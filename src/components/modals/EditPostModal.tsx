import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
} from "antd";
import React from "react";
import { useAuth } from "../../contexts/auth";
import { inferQueryOutput, trpc } from "../../utils/trpc";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  post: inferQueryOutput<"posts.post">;
};

function EditPostModal({ isOpen, post, onClose }: Props) {
  const { user } = useAuth();
  const mutation = trpc.useMutation("posts.updatePost");
  const utils = trpc.useContext();

  if (!post) {
    return <p>Post not found</p>;
  }

  const onSubmit = async (values: any) => {
    try {
      await mutation.mutateAsync({
        id: post.id,
        ...values,
      });
      utils.invalidateQueries([
        "posts.post",
        {
          id: post.id,
        },
      ]);

      message.success("You have successfully updated the post");
      onClose();
    } catch (error) {
      console.error(error);
      if (mutation.isError) {
        message.error(mutation.error.message);
        return;
      }
      message.error("Something wrong happended");
    }
  };

  return (
    <>
      {post.author.id === user?.id && (
        <Modal
          zIndex={1200}
          width={700}
          title="Edit Post"
          visible={isOpen}
          confirmLoading={mutation.isLoading}
          okText="Update"
          cancelText="Cancel"
          onCancel={onClose}
          footer={null}
        >
          <Form
            layout="vertical"
            name="form"
            autoComplete="off"
            onFinish={onSubmit}
            requiredMark={"optional"}
            disabled={mutation.isLoading}
          >
            <Form.Item
              name="image"
              noStyle
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload.Dragger
                maxCount={1}
                listType="picture"
                disabled={false}
                accept="image/*"
                multiple={false}
              >
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "This field is required",
                },
              ]}
              initialValue={post.title}
            >
              <Input placeholder="Enter your design title here" />
            </Form.Item>
            <Form.Item
              name="softwares"
              label="Softwares"
              rules={[
                {
                  required: true,
                  message: "This field is required",
                },
              ]}
              initialValue={post.softwares?.split(",")}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Figma, Adobe XD..."
              >
                <Select.Option value="Figma">Figma</Select.Option>
                <Select.Option value="Adobe XD">Adobe XD</Select.Option>
                <Select.Option value="Adobe Illustrator">
                  Adobe Illustrator
                </Select.Option>
                <Select.Option value="Adobe Photoshop">
                  Adobe Photoshop
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="tags"
              label="Tags"
              rules={[
                {
                  required: true,
                  message: "Please type some tags!",
                },
              ]}
              initialValue={post.tags?.split(",")}
            >
              <Select
                maxTagTextLength={10}
                open={false}
                allowClear
                mode="tags"
                placeholder="Enter a tag and hit enter"
              />
            </Form.Item>
            <Form.Item
              name="isPrivate"
              valuePropName="checked"
              initialValue={post.isPrivate ?? false}
            >
              <Checkbox>Make this post private</Checkbox>
            </Form.Item>
            <Form.Item className="m-0">
              <footer className="p-4 pb-0 border-t w-full flex gap-8 items-center justify-end">
                <Button onClick={() => onClose()} type="dashed">
                  Cancel
                </Button>
                <Button htmlType="submit">Submit</Button>
              </footer>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default EditPostModal;
