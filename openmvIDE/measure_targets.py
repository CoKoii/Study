import math
import sensor
import time


A4_WIDTH_CM = 21.0
A4_HEIGHT_CM = 29.7
# 焦距像素值需要按你的摄像头实测标定，D 不准时优先调这里。
FOCAL_LENGTH_PX = 620.0
# 黑色阈值受光照影响很大，出现图形漏检/误检时调这里。
BLACK_THRESHOLD = (0, 70)
# 外框检测阈值，A4 边框找不稳时增减这个值。
RECT_THRESHOLD = 18000
# 目标纸离得太远时可适当减小，误检太多时可适当增大。
MIN_PAPER_W = 40
MIN_PAPER_H = 60
# 图形太小时可减小，噪点被误识别时可增大。
MIN_SHAPE_PIXELS = 300
# 内缩 ROI，用来避开 A4 黑边框；如果把边框当成图形就增大它。
ROI_MARGIN_PX = 12


sensor.reset()
sensor.set_pixformat(sensor.GRAYSCALE)
sensor.set_framesize(sensor.QVGA)
# 刚启动摄像头时先等画面稳定。
sensor.skip_frames(time=2000)
sensor.set_auto_gain(False)
sensor.set_auto_whitebal(False)
clock = time.clock()


def distance(p1, p2):
    dx = p1[0] - p2[0]
    dy = p1[1] - p2[1]
    return math.sqrt(dx * dx + dy * dy)


def rect_size(corners):
    top = distance(corners[0], corners[1])
    right = distance(corners[1], corners[2])
    bottom = distance(corners[2], corners[3])
    left = distance(corners[3], corners[0])
    return (top + bottom) / 2.0, (left + right) / 2.0


def normalize_paper_size(width_px, height_px):
    if width_px < height_px:
        return width_px, height_px
    return height_px, width_px


def pick_paper_rect(img):
    best_rect = None
    best_score = 0

    for rect in img.find_rects(threshold=RECT_THRESHOLD):
        x, y, w, h = rect.rect()
        if w < MIN_PAPER_W or h < MIN_PAPER_H:
            continue

        paper_w_px, paper_h_px = normalize_paper_size(*rect_size(rect.corners()))
        # A4 长宽比约 29.7 / 21 = 1.414，范围放宽一点便于现场调试。
        if paper_w_px <= 0 or not 1.25 <= (paper_h_px / paper_w_px) <= 1.55:
            continue

        # 优先取面积最大的矩形，默认它就是目标纸。
        score = w * h
        if score > best_score:
            best_rect = rect
            best_score = score

    return best_rect


def clamp_roi(x, y, w, h, margin, img_w, img_h):
    x2 = max(0, x + margin)
    y2 = max(0, y + margin)
    w2 = max(1, min(img_w - x2, w - 2 * margin))
    h2 = max(1, min(img_h - y2, h - 2 * margin))
    return (x2, y2, w2, h2)


def classify_shape(blob):
    density = blob.density()
    # density 是图形在外接框中的填充率：
    # 圆约 0.78，等边三角形更小，正方形接近 1。
    # 如果形状分类不准，主要调这里的分界。
    if 0.70 <= density <= 0.86:
        return "circle"
    if density < 0.66:
        return "triangle"
    return "square"


def measure_shape_cm(blob, cm_per_px):
    area_px = max(blob.pixels(), 1)
    shape_type = classify_shape(blob)

    if shape_type == "circle":
        diameter_px = 2.0 * math.sqrt(area_px / math.pi)
        return shape_type, diameter_px * cm_per_px

    if shape_type == "triangle":
        side_px = math.sqrt((4.0 * area_px) / math.sqrt(3.0))
        return shape_type, side_px * cm_per_px

    side_px = math.sqrt(area_px)
    return shape_type, side_px * cm_per_px


def pick_shape_blob(img, roi):
    blobs = img.find_blobs(
        [BLACK_THRESHOLD],
        roi=roi,
        merge=True,
        pixels_threshold=MIN_SHAPE_PIXELS,
        area_threshold=MIN_SHAPE_PIXELS,
    )
    if not blobs:
        return None
    # 默认认为纸面中最大的黑色连通域就是目标图形。
    return max(blobs, key=lambda b: b.pixels())


def draw_paper(img, rect):
    corners = rect.corners()
    for i in range(4):
        p1 = corners[i]
        p2 = corners[(i + 1) % 4]
        img.draw_line(p1[0], p1[1], p2[0], p2[1], color=255, thickness=2)
    return corners


def draw_text_block(img, d_cm, x_cm, shape_type):
    img.draw_string(4, 4, "D=%.1fcm" % d_cm, color=255, scale=2)
    img.draw_string(4, 24, "x=%.1fcm" % x_cm, color=255, scale=2)
    img.draw_string(4, 44, shape_type, color=255, scale=2)


while True:
    clock.tick()
    img = sensor.snapshot()

    paper_rect = pick_paper_rect(img)
    if not paper_rect:
        img.draw_string(4, 4, "paper not found", color=255, scale=2)
        print("paper not found")
        continue

    corners = draw_paper(img, paper_rect)
    paper_w_px, paper_h_px = normalize_paper_size(*rect_size(corners))
    # 用 A4 实际尺寸和成像尺寸估计距离，结果偏大/偏小通常是焦距没标准。
    d_cm = (
        FOCAL_LENGTH_PX * A4_WIDTH_CM / max(paper_w_px, 1.0) +
        FOCAL_LENGTH_PX * A4_HEIGHT_CM / max(paper_h_px, 1.0)
    ) / 2.0

    x, y, w, h = paper_rect.rect()
    roi = clamp_roi(x, y, w, h, ROI_MARGIN_PX, img.width(), img.height())
    # 调试时可以看这个框是否只覆盖纸面内部。
    img.draw_rectangle(roi, color=200)

    shape_blob = pick_shape_blob(img, roi)
    if not shape_blob:
        img.draw_string(4, 4, "shape not found", color=255, scale=2)
        print("shape not found, D=%.2fcm" % d_cm)
        continue

    img.draw_rectangle(shape_blob.rect(), color=255, thickness=2)
    img.draw_cross(shape_blob.cx(), shape_blob.cy(), color=255, size=8)

    # 像素转厘米的比例由当前检测到的 A4 尺寸换算得到。
    cm_per_px = ((A4_WIDTH_CM / paper_w_px) + (A4_HEIGHT_CM / paper_h_px)) / 2.0
    shape_type, x_cm = measure_shape_cm(shape_blob, cm_per_px)

    draw_text_block(img, d_cm, x_cm, shape_type)
    print("D=%.2fcm, x=%.2fcm, type=%s, fps=%.2f" % (d_cm, x_cm, shape_type, clock.fps()))
