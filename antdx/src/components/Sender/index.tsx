import { CloudUploadOutlined, LinkOutlined } from "@ant-design/icons";
import {
  Attachments,
  type AttachmentsProps,
  Sender as AntXSender,
} from "@ant-design/x";
import {
  App,
  Button,
  Divider,
  Flex,
  Switch,
  theme,
  type GetProp,
  type GetRef,
} from "antd";
import { useEffect, useRef, useState } from "react";

interface SenderProps {
  onRequest?: (message: string) => void;
  isRequesting?: boolean;
}

const Demo: React.FC<SenderProps> = ({ onRequest, isRequesting }) => {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<GetProp<AttachmentsProps, "items">>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deepThinking, setDeepThinking] = useState<boolean>(false);

  const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
  const senderRef = useRef<GetRef<typeof AntXSender>>(null);

  const iconStyle = {
    fontSize: 18,
    color: token.colorText,
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setText("");
        setItems([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onRequest?.(text);
    setLoading(true);
  };

  const handleAttachmentClick = () => setOpen(!open);

  const senderHeader = (
    <AntXSender.Header
      title="附件"
      styles={{ content: { padding: 0 } }}
      open={open}
      onOpenChange={setOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        beforeUpload={() => false}
        items={items}
        onChange={({ fileList }) => setItems(fileList)}
        placeholder={(type) =>
          type === "drop"
            ? { title: "拖拽文件至此处" }
            : {
                icon: <CloudUploadOutlined />,
                title: "上传文件",
                description: "点击或拖拽文件到此区域上传",
              }
        }
        getDropContainer={() => senderRef.current?.nativeElement}
      />
    </AntXSender.Header>
  );

  return (
    <Flex
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        position: "absolute",
        left: "50%",
        bottom: "0",
        transform: "translateX(-50%)",
      }}
      align="end"
    >
      <AntXSender
        ref={senderRef}
        header={senderHeader}
        value={text}
        onChange={setText}
        loading={isRequesting || loading}
        allowSpeech={true}
        autoSize={{ minRows: 2 }}
        submitType="enter"
        placeholder="按回车键发送消息"
        onPasteFile={(_, files) => {
          for (const file of files) {
            attachmentsRef.current?.upload(file);
          }
          setOpen(true);
        }}
        onSubmit={handleSubmit}
        onCancel={() => setLoading(false)}
        actions={false}
        footer={({ components }) => {
          const { SendButton, LoadingButton } = components;
          return (
            <Flex justify="space-between" align="center">
              <Flex gap="small" align="center">
                <Button
                  style={iconStyle}
                  type="text"
                  icon={<LinkOutlined />}
                  onClick={handleAttachmentClick}
                />
                <Divider type="vertical" />
                深度思考
                <Switch
                  size="small"
                  checked={deepThinking}
                  onChange={setDeepThinking}
                />
              </Flex>
              <Flex align="center">
                {isRequesting || loading ? (
                  <LoadingButton type="default" />
                ) : (
                  <SendButton type="primary" disabled={false} />
                )}
              </Flex>
            </Flex>
          );
        }}
      />
    </Flex>
  );
};

const Sender: React.FC<SenderProps> = (props) => (
  <App>
    <Demo {...props} />
  </App>
);

export default Sender;
