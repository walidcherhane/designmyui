import { TRPCClientError } from "@trpc/client";
import { Button, Form, Input, message, Modal, Space, Typography } from "antd";
import React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { trpc } from "../../utils/trpc";
const { Text } = Typography;
import { signOut } from "next-auth/react";

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

function DeleteAccount({ isOpen, onClose }: Props) {
  const mutation = trpc.useMutation(["users.deleteAccount"]);
  const onSubmit = async (values: any) => {
    try {
      await mutation.mutateAsync(values);
      console.log(mutation);
      message.success(mutation.data?.message);
      signOut();
    } catch (error) {
      if (error instanceof TRPCClientError) {
        return message.error(error.message);
      }
      message.error(mutation.error?.message);
    }
  };
  return (
    <>
      <Modal
        title="Delete Account"
        visible={isOpen}
        onCancel={onClose}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          name="form"
          autoComplete="off"
          onFinish={onSubmit}
          requiredMark={"optional"}
          disabled={mutation.isLoading}
          className="flex flex-col gap-y-4"
        >
          <Text type="warning">
            <Space align="start">
              This actions is for sure NOT reversible. keep in mind that if you
              have any posts, they won&apos;t be deleted, you will have to
              delete them manually.
            </Space>
          </Text>
          <Text type="warning">
            Please Type <Text type="danger"> DELETE MY ACCOUNT </Text> to
            confirm your action.
          </Text>
          <Form.Item
            name="confirmation"
            rules={[
              {
                required: true,
                message: "Please input your confirmation!",
              },
              {
                validator(rule, value, callback) {
                  if (value.toLowerCase() === "delete my account") {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Please match the confirmation with the text above."
                    )
                  );
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="ml-auto mt-3">
            <Button type="dashed" onClick={onClose}>
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              danger
              ghost
              className="ml-3"
              loading={mutation.isLoading}
            >
              Delete Account
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DeleteAccount;
