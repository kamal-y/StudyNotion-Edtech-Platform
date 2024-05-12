import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

const {CATALOGPAGEDATA_API} = catalogData;
export const getCatalogaPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
      console.log("Idhar aaya->pageAndComponentPage");
        const response = await apiConnector("POST", CATALOGPAGEDATA_API, 
        {categoryId: categoryId,});
        console.log("Idhar aaya1->pageAndComponentPage");

        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

         result = response?.data;

  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

