import React, { useState } from "react";
import axios from "axios";
import TemplateInfo from "./TemplateInfo";

const Form = () => {
  let [email, setEmail] = useState("");
  let [name, setName] = useState("");
  let [templateDetails, setTemplateDetails] = useState();
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState();

  const submit = async (e) => {
    e.preventDefault();
    console.log(email, name);
    setLoading(true);
    setTemplateDetails();

    try {
      let res = await axios.post(
        "https://docusign-production.up.railway.app/docusign",
        {
          email: email,
          name: name,
        }
      );

      res = res.data;
      console.log(res);
      setLoading(false);

      if (res.results) {
        setTemplateDetails(res.templateDetails);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="w-full max-w-xs h-1/2 my-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={submit}
            >
              Get template details and email
            </button>
          </div>
        </form>
        {templateDetails && <TemplateInfo details={templateDetails} />}
        {loading && "loading..."}
        {error}
      </div>
    </>
  );
};

export default Form;
