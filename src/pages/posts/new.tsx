import { Select, Input, Spin, Checkbox, Form, Button, message } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { trpc } from "../../utils/trpc";

import Dropzone from "../../components/Dropzone";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
const { Option } = Select;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {} as any,
  };
};

function NewPost() {
  const [tagFocused, setTagFocused] = useState(false);
  const router = useRouter();
  const mutation = trpc.useMutation("posts.newPost");
  const [imageUrl, setImageUrl] = useState<string>();
  const tagsQuery = trpc.useQuery(["posts.getAllTags"], {
    enabled: tagFocused,
  })
  const suggestedTags = [...new Set(tagsQuery.data?.map((group)=> group.tags?.split(',')).filter((tag)=> tag !== null).flat(2))]
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
                  autoComplete="off"
                  onFinish={onFinish}
                  hideRequiredMark
                >
                  {imageUrl ? (
                    <div
                      onClick={() => setImageUrl(undefined)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl text-white after:transition-all"
                    >
                      <AiOutlineClose className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-4xl opacity-0 transition-all group-hover:opacity-100" />
                      <div className=" after:absolute after:inset-0 after:z-10 after:transition-all group-hover:after:bg-gray-800/40" />
                      <Image
                        width={500}
                        height={300}
                        className=" h-full w-full rounded-xl object-cover"
                        src={imageUrl}
                        alt=""
                      />
                    </div>
                  ) : (
                    <Form.Item
                      name="image"
                      rules={[
                        {
                          required: true,
                          message: "Please upload an image",
                        },
                      ]}
                    >
                      <Dropzone
                        onDrop={(url) => {
                          setImageUrl(url);
                        }}
                      />
                    </Form.Item>
                  )}
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
                      allowClear
                      mode="tags"
                      placeholder="Enter a tag and hit enter"
                      notFoundContent={tagsQuery.isLoading ? <Spin size="small" className="mx-auto w-full" /> : null}
                      tokenSeparators={[',',' ']}
                      onFocus={() => setTagFocused(true)}
                    >
                       {suggestedTags.map((t, i)=> (
                          <Option key={`${t}--${i}`} value={t}>{t}</Option>
                       ) )}
                    </Select>
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
