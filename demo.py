import math
import sensor
import time


FRAME_SIZE = sensor.QQVGA
AUTO_EXPOSURE_SETTLE_MS = 300
MANUAL_EXPOSURE_US = 1500
MANUAL_GAIN_DB = 0
IMAGE_BRIGHTNESS = -3
IMAGE_CONTRAST = 2

MIN_LINE_LENGTH = 16
MIN_LINE_LENGTH_SQ = MIN_LINE_LENGTH * MIN_LINE_LENGTH
PAIR_DISTANCE_LIMIT = 90
PAIR_DISTANCE_LIMIT_SQ = PAIR_DISTANCE_LIMIT * PAIR_DISTANCE_LIMIT
MIN_SIDE_LENGTH = 12
MIN_SIDE_LENGTH_SQ = MIN_SIDE_LENGTH * MIN_SIDE_LENGTH
MIN_TRIANGLE_AREA = 80
MAX_TRIANGLES = 1


sensor.reset()
sensor.set_pixformat(sensor.GRAYSCALE)
sensor.set_framesize(FRAME_SIZE)
sensor.skip_frames(time=AUTO_EXPOSURE_SETTLE_MS)
sensor.set_auto_exposure(False, exposure_us=MANUAL_EXPOSURE_US)
sensor.set_auto_gain(False, gain_db=MANUAL_GAIN_DB)
sensor.set_auto_whitebal(False)
sensor.set_brightness(IMAGE_BRIGHTNESS)
sensor.set_contrast(IMAGE_CONTRAST)
sensor.skip_frames(time=700)
clock = time.clock()


def distance_sq(p1, p2):
    dx = p1[0] - p2[0]
    dy = p1[1] - p2[1]
    return dx * dx + dy * dy


def line_length_sq(line):
    dx = line.x1() - line.x2()
    dy = line.y1() - line.y2()
    return dx * dx + dy * dy


def line_intersection(line1, line2):
    x1, y1, x2, y2 = line1.line()
    x3, y3, x4, y4 = line2.line()

    denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if denom == 0:
        return None

    det1 = x1 * y2 - y1 * x2
    det2 = x3 * y4 - y3 * x4
    px = (det1 * (x3 - x4) - (x1 - x2) * det2) / denom
    py = (det1 * (y3 - y4) - (y1 - y2) * det2) / denom
    return (int(px), int(py))


def triangle_area(p1, p2, p3):
    return abs(
        p1[0] * (p2[1] - p3[1]) +
        p2[0] * (p3[1] - p1[1]) +
        p3[0] * (p1[1] - p2[1])
    ) / 2.0


def triangle_centroid(p1, p2, p3):
    return (
        (p1[0] + p2[0] + p3[0]) / 3.0,
        (p1[1] + p2[1] + p3[1]) / 3.0,
    )


def inside_image(point, width, height):
    return 0 <= point[0] < width and 0 <= point[1] < height


def line_pair_close(line1, line2):
    p11 = (line1.x1(), line1.y1())
    p12 = (line1.x2(), line1.y2())
    p21 = (line2.x1(), line2.y1())
    p22 = (line2.x2(), line2.y2())

    return min(
        distance_sq(p11, p21),
        distance_sq(p11, p22),
        distance_sq(p12, p21),
        distance_sq(p12, p22),
    ) <= PAIR_DISTANCE_LIMIT_SQ


def filter_segments(segments):
    lines = []
    for line in segments:
        if line_length_sq(line) >= MIN_LINE_LENGTH_SQ:
            lines.append(line)
    return lines


def score_triangle(p1, p2, p3, img_center):
    side12 = distance_sq(p1, p2)
    side23 = distance_sq(p2, p3)
    side31 = distance_sq(p3, p1)
    if (
        side12 < MIN_SIDE_LENGTH_SQ or
        side23 < MIN_SIDE_LENGTH_SQ or
        side31 < MIN_SIDE_LENGTH_SQ
    ):
        return None

    area = triangle_area(p1, p2, p3)
    if area < MIN_TRIANGLE_AREA:
        return None

    centroid = triangle_centroid(p1, p2, p3)
    center_bias = distance_sq(centroid, img_center)
    perimeter_bias = abs(side12 - side23) + abs(side23 - side31) + abs(side31 - side12)
    return center_bias + perimeter_bias * 0.02 - area * 6


def find_best_triangles(lines, img_width, img_height):
    pair_points = {}
    line_count = len(lines)

    for i in range(line_count):
        for j in range(i + 1, line_count):
            line1 = lines[i]
            line2 = lines[j]
            if not line_pair_close(line1, line2):
                continue

            point = line_intersection(line1, line2)
            if point and inside_image(point, img_width, img_height):
                pair_points[(i, j)] = point

    best = []
    seen = set()
    img_center = (img_width / 2.0, img_height / 2.0)

    for i in range(line_count):
        for j in range(i + 1, line_count):
            p1 = pair_points.get((i, j))
            if not p1:
                continue

            for k in range(j + 1, line_count):
                p2 = pair_points.get((j, k))
                p3 = pair_points.get((i, k))
                if not p2 or not p3:
                    continue

                key = tuple(sorted((p1, p2, p3)))
                if key in seen:
                    continue
                seen.add(key)

                score = score_triangle(p1, p2, p3, img_center)
                if score is None:
                    continue

                best.append((score, (p1, p2, p3)))

    best.sort(key=lambda item: item[0])
    triangles = []
    for _, triangle in best[:MAX_TRIANGLES]:
        triangles.append(triangle)
    return triangles


while True:
    clock.tick()
    img = sensor.snapshot()

    segments = img.find_line_segments(
        merge_distance=8,
        max_theta_diff=1,
    )
    lines = filter_segments(segments)
    triangles = find_best_triangles(lines, img.width(), img.height())

    for p1, p2, p3 in triangles:
        img.draw_line(p1[0], p1[1], p2[0], p2[1], 255, 2)
        img.draw_line(p2[0], p2[1], p3[0], p3[1], 255, 2)
        img.draw_line(p3[0], p3[1], p1[0], p1[1], 255, 2)

    print("triangles=%d fps=%.2f" % (len(triangles), clock.fps()))
