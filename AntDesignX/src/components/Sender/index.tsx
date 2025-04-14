import {
  ApiOutlined,
  CloudUploadOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  Attachments,
  AttachmentsProps,
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

const Demo = () => {
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
        console.log("Send message successfully!");
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  const handleAttachmentClick = () => {
    setOpen(!open);
  };

  const senderHeader = (
    <AntXSender.Header
      title="附件"
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={open}
      onOpenChange={setOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        // Mock not real upload file
        beforeUpload={() => false}
        items={items}
        onChange={({ fileList }) => setItems(fileList)}
        placeholder={(type) =>
          type === "drop"
            ? {
                title: "拖拽文件至此处",
              }
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
    <Flex style={{ width: "30vw", margin: "50px 0 15vh 0" }} align="end">
      <AntXSender
        ref={senderRef}
        header={senderHeader}
        value={text}
        onChange={setText}
        loading={loading}
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
        onSubmit={() => {
          setLoading(true);
        }}
        onCancel={() => {
          setLoading(false);
        }}
        actions={false}
        footer={({ components }) => {
          const { SendButton, LoadingButton, SpeechButton } = components;
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
                <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
                <Divider type="vertical" />
                <SpeechButton style={iconStyle} />
                <Divider type="vertical" />
                {loading ? (
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

const Sender = () => {
  return (
    <App>
      <Demo />
    </App>
  );
};

export default Sender;
