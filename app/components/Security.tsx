"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

const Security = () => {
  return (
    <>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Password</h6>
            <span className=" text-subtitle">Lorem ipsum dolor sit amet.</span>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8 mb-3">
            <h6 className=" font-semibold">Current Password</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input type="password" />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8 mb-3">
            <h6 className=" font-semibold">New Password</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <Input type="password" />
            <span className=" text-subtitle">
              Your new password must be more than 8 characters.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8 mb-3">
            <h6 className=" font-semibold">Confirm New Password</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input type="password" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="py-3 flex gap-2">
            {/* <div>
              <Button theme="light" className=" py-2">
                Cancel
              </Button>
            </div> */}
            <div>
              <Button className=" py-2">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security;
