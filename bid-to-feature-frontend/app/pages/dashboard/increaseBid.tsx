import { LoadingState } from "~/utils/enum";
import { Button, ButtonOutline } from "~/components/button";
import { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import InputAmount from "~/components/input/amount";

interface FormDataProps {
  amount: string;
}

export default function IncreaseBid() {
  const [show, setShow] = useState<boolean>(false);
  const initialFormData: FormDataProps = {
    amount: "",
  };
  const [formData, setFormData] = useState<FormDataProps>(initialFormData);
  const resetFormData = () => {
    setFormData(initialFormData);
  };
  const [isLoading, setIsLoading] = useState<LoadingState>(
    LoadingState.RESOLVED
  );

  const handleNumberInput = (e: any) => {
    const { name, value } = e.target;
    if (!isNaN(value)) {
      setFormData((prevSetFormData: any) => ({
        ...prevSetFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {};
  return (
    <>
      <ButtonOutline
        text="Increase Bid"
        onClick={() => setShow(true)}
        className="text-xs hover:text-black"
      />

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-40 bg-black/90 flex  justify-center overflow-auto ">
          <div className="relative w-full max-w-md p-4 lg:mt-10">
            <div className="bg-white rounded-lg shadow-lg p-6 relative ">
              <p className="text-lg font-bold text-black">Increase Bid</p>
              <p className="text-md text-gray-400">I9XUZG4</p>
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
                  <div className="mb-2 ">
                    <p>Current Amount</p>
                    <div className="pl-18 h-[50px] border border-gray-200 rounded-lg relative flex  items-center">
                      <span className="absolute font-medium  left-3 top-3 text-[15px]">
                        {"SOL"}
                      </span>
                      <span className="text-xl font-bold text-gray-500">
                        0.2
                      </span>
                    </div>

                    <div className="my-4"></div>
                    <p>Additional Amount</p>
                    <InputAmount
                      name="amount"
                      formData={formData}
                      handleChange={handleNumberInput}
                    />
                  </div>
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
    </>
  );
}
