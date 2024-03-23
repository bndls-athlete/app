import Button from "../../../../components/Button";
import Input from "@/app/components/Input";
import Textarea from "@/app/components/Textarea";

const BussinesInformation = () => {
  return (
    <>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Company Profile</h6>
            <span className=" text-subtitle">
              Update your company photo and details here.
            </span>
          </div>
          <div className="py-3 flex gap-2">
            <div>
              <Button theme="light" className=" py-2">
                Cancel
              </Button>
            </div>
            <div>
              <Button className=" py-2">Save</Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className=" font-semibold">Company Name</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className=" font-semibold">Industry</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className=" font-semibold">What do you do?</h6>
            <span className=" text-subtitle">
              Write a short introduction about who your company serves and how.
            </span>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Textarea></Textarea>
            <span className=" text-subtitle">400 characters left.</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="py-3 flex gap-2">
            <div>
              <Button theme="light" className=" py-2">
                Cancel
              </Button>
            </div>
            <div>
              <Button className=" py-2">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BussinesInformation;
