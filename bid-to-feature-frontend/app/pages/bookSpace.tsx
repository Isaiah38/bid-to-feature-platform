import { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { Button, ButtonOutline } from "~/components/button";
import CountdownTimer from "~/components/countdownTimer";
import InputAmount from "~/components/input/amount";
import { InputField } from "~/components/input/input-field";
import { LoadingState } from "~/utils/enum";

interface FormDataProps {
  amount: string;
  category_id: number;
  item_image_url: string;
  item_title: string;
  item_link: string;
}

export default function BookSpacePage() {
  const initialFormData: FormDataProps = {
    amount: "",
    category_id: 1,
    item_image_url: "",
    item_title: "",
    item_link: "",
  };

  const [formData, setFormData] = useState<FormDataProps>(initialFormData);

  const resetFormData = () => {
    setFormData(initialFormData);
  };
  const startDate = new Date("2025-09-18T17:40:25.370Z");
  const endDate = new Date("2025-09-19T17:40:25.370Z");
  // const endDate = new Date();
  // endDate.setDate(endDate.getDate() + 1);
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<LoadingState>(
    LoadingState.RESOLVED
  );
  const [errors, setErrors] = useState<Partial<FormDataProps>>({});

  const handleNumberInput = (e: any) => {
    const { name, value } = e.target;
    if (!isNaN(value)) {
      setFormData((prevSetFormData: any) => ({
        ...prevSetFormData,
        [name]: value,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevSetFormData: any) => ({
      ...prevSetFormData,
      [name]: value,
    }));
  };

  const download = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "formData.json"; // filename
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateBookingForm = (formDatas: typeof formData) => {
    const newErrors: Record<string, string> = {};

    if (!formDatas.item_image_url)
      newErrors.item_image_url = "Item image is required";
    if (!formDatas.item_title) newErrors.item_title = "Item title is required";
    if (!formDatas.item_link) newErrors.item_link = "Item link is required";

    return newErrors;
  };

  const handleSubmit = async () => {};

  return (
    <main>
      <div className="p-6 rounded-xl bg-white shadow-xs border border-gray-100 max-w-[700px]">
        <h2 className="text-lg font-semibold text-black">Business</h2>
        <p className="text-gray-500 text-sm">
          Get your project, businesses, startups featured and more visiblity
        </p>
        <div className="mt-4 space-y-4">
          <CountdownTimer
            startDate={startDate}
            endDate={endDate}
            onComplete={() => alert("Auction ended!")}
          />

          <ButtonOutline
            text="Place Bid"
            onClick={() => setShow(true)}
            className="text-xs hover:text-black "
          />
        </div>
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-40 bg-black/90 flex  justify-center overflow-auto ">
          <div className="relative w-full max-w-md p-4 lg:mt-10">
            <div className="bg-white rounded-lg shadow-lg p-6 relative ">
              <p className="text-lg font-bold text-black">Place your Bid</p>
              {/* Close button */}
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => {
                  setShow(false);
                  resetFormData();
                }}
                className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <RiCloseLargeLine className="size-4" />
              </button>

              {/* Modal content */}
              <div className="mt-6 space-y-4">
                <div className="space-y-2 ">
                  <div className="mb-2">
                    <InputAmount
                      name="amount"
                      formData={formData}
                      handleChange={handleNumberInput}
                    />
                  </div>
                  <h2 className="text-black text-lg my-2">Business Details</h2>
                  <InputField
                    label="Image Url"
                    name="item_image_url"
                    placeholder="Enter Image Url"
                    value={formData.item_image_url}
                    onChange={handleChange}
                    error={errors.item_image_url}
                  />
                  <InputField
                    label="Title"
                    name="item_title"
                    placeholder="Enter title"
                    value={formData.item_title}
                    onChange={handleChange}
                    error={errors.item_title}
                  />
                  <InputField
                    label="Link"
                    name="item_link"
                    placeholder="Enter Link"
                    value={formData.item_link}
                    onChange={handleChange}
                    error={errors.item_link}
                  />
                </div>

                <Button
                  text={
                    isLoading === LoadingState.UPDATING
                      ? "Loading..."
                      : "Submit"
                  }
                  onClick={handleSubmit}
                  className=" text-lg py-4 w-full "
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
