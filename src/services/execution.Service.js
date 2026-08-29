import axios from "axios";
import {executeURL} from '../api/urlEndPoint'

export const executeCode = async (code, language, input) => {
  try {
    const response = await axios.post(executeURL, {
      code,
      language,
      input,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Execution failed" };
  }
};
