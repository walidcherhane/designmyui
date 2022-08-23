import { TRPCClientError } from "@trpc/client";
import {
  Select,
  Input,
  Spin,
  Checkbox,
  Form,
  Button,
  Upload,
  message,
} from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { getBase64 } from "../../utils";
import { trpc } from "../../utils/trpc";

import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt10M;
};

function NewPost() {
  const router = useRouter();
  const mutation = trpc.useMutation("posts.newPost");
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageUrl(url);
      });
    }
  };
  const onFinish = async (values: any) => {
    try {
      await mutation.mutateAsync({
        ...values,
        image: imageUrl,
      });
      router.push("/posts");
    } catch (error) {
      if (mutation.isError) {
        return message.error(mutation.error.message);
      } else {
        message.error("Something went wrong");
        console.log(error);
      }
    }
  };

  return (
    <Spin spinning={mutation.isLoading}>
      <div className="flex  min-h-screen flex-col justify-center py-6 font-default sm:py-0">
        <div className="relative py-3 sm:mx-auto sm:max-w-xl">
          <div className="relative mx-8 rounded-3xl bg-white px-4 py-10 shadow sm:p-10 md:mx-0">
            <div className="mx-auto max-w-md">
              <div className="flex items-center space-x-5">
                <div className="flex h-14 w-14  flex-shrink-0 items-center  justify-center rounded-full bg-violet-50  from-[#8E2DE2] to-[#4A00E0] font-mono text-2xl text-gray-400 ">
                  <HiOutlinePlus />
                </div>
                <div className="block self-start pl-2 text-xl font-semibold ">
                  <h2 className="text-xl font-bold">Share your design!</h2>
                  <p className=" text-sm font-normal leading-tight text-gray-500">
                    Share your designs with anybody who is interested in using
                    them as inspiration or research material.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Form
                  layout="vertical"
                  name="form"
                  autoComplete="off"
                  onFinish={onFinish}
                  requiredMark={"optional"}
                >
                  <Form.Item
                    name="image"
                    rules={[
                      {
                        required: true,
                        message: "Please upload an image",
                      },
                    ]}
                  >
                    <Upload.Dragger
                      maxCount={1}
                      listType="picture"
                      accept="image/*"
                      withCredentials={true}
                      multiple={false}
                      onChange={handleChange}
                      beforeUpload={beforeUpload}
                    >
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="text-gray-400 ">
                        Support for a single jpg, png or webp image file
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                  <Form.Item
                    label="Title"
                    name="title"
                    className="mt-4"
                    rules={[
                      {
                        required: true,
                        message: "This field is required",
                      },
                    ]}
                  >
                    <Input placeholder="Enter a title here" />
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
                        message: "Please insert some tags",
                      },
                    ]}
                  >
                    <Select
                      maxTagTextLength={10}
                      open={false}
                      allowClear
                      mode="tags"
                      placeholder="Enter a tag and hit enter"
                    />
                  </Form.Item>
                  <Form.Item name="isPrivate" valuePropName="checked">
                    <Checkbox>Keep this private</Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={mutation.isLoading}
                      className="mt-3"
                      htmlType="submit"
                    >
                      {mutation.isLoading ? "Loading..." : "Submit"}
                    </Button>{" "}
                    <Button type="dashed" htmlType="reset">
                      Reset
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default NewPost;
