import { TRPCClientError } from "@trpc/client";
import { Button, Form, Input, message, Modal } from "antd";
import React from "react";
import { trpc } from "../../utils/trpc";

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

function ChangePasswordModal({ isOpen, onClose }: Props) {
  const { data } = trpc.useQuery(["users.requestUserData"]);
  const mutation = trpc.useMutation(["users.updatePassword"]);
  const onSubmit = async (values: any) => {
    try {
      await mutation.mutateAsync(values);
      message.success("Password updated successfully!");
      onClose();
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
        destroyOnClose
        title="Change Password"
        visible={isOpen}
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
          {data?.hasOldPassword && (
            <Form.Item
              label="Current Password"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            hasFeedback
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="ml-auto">
            <Button type="dashed" onClick={onClose}>
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              ghost
              className="ml-3"
              loading={mutation.isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ChangePasswordModal;
