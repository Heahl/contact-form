import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import { z } from "zod";

type FormDataProps = {
  queryType: "generalEnquiry" | "supportRequest" | null;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  consent: boolean;
};

type FormErrorsProps = {
  queryType?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  consent?: string;
};

const queryTypeSchema = z.enum(["generalEnquiry", "supportRequest"]);
const firstNameSchema = z.string().min(2).max(50);
const lastNameSchema = z.string().min(2).max(50);
const emailSchema = z.string().email();
const messageSchema = z.string().min(10).max(500);
const consentSchema = z.literal(true);

export default function Home() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [consent, setConsent] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrorsProps>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const getFormData = () => ({
    queryType: selectedQuery as "generalEnquiry" | "supportRequest" | null,
    firstName,
    lastName,
    email,
    message,
    consent,
  });

  function validateForm(formData: FormDataProps): FormErrorsProps {
    const errors: FormErrorsProps = {};

    const queryTypeResult = queryTypeSchema.safeParse(formData.queryType);
    if (!queryTypeResult.success) {
      errors.queryType = "Please select a query type";
    }

    const firstNameResult = firstNameSchema.safeParse(formData.firstName);
    if (!firstNameResult.success) {
      errors.firstName = "First name must be between 2 and 50 characters";
    } else if (formData.firstName.trim() === "") {
      errors.firstName = "This field is required";
    }

    const lastNameResult = lastNameSchema.safeParse(formData.lastName);
    if (!lastNameResult.success) {
      errors.lastName = "Last name must be between 2 and 50 characters";
    } else if (formData.lastName.trim() === "") {
      errors.lastName = "This field is required";
    }

    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      errors.email = "Please enter a valid email address";
    }

    const messageResult = messageSchema.safeParse(formData.message);
    if (!messageResult.success) {
      errors.message = "Message must be between 10 and 500 characters.";
    } else if (formData.message.trim() === "") {
      errors.message = "This field is required";
    }

    const consentResult = consentSchema.safeParse(formData.consent);
    if (!consentResult.success) {
      errors.consent = "To submit this form, please consent to being contacted";
    }

    return errors;
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormSubmitted(true);
    const formData = getFormData();

    const validationErrors = validateForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setShowPopup(true);
      window.setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }
  }

  return (
    <>
      <Head>
        <title>Contact Form</title>
        <meta name="description" content="contact-form" />
        <link rel="icon" href="/images/favicon-32x32.png" />
      </Head>
      <main className="font-karla relative flex min-h-screen flex-col items-center justify-center bg-green-200 text-grey-900">
        {/* Popup */}
        {showPopup && (
          <div className="absolute top-3 flex flex-col gap-2 rounded-2xl bg-teal-900 p-8">
            <div className="flex w-full gap-4">
              <Image
                src={"/images/icon-success-check.svg"}
                width={24}
                height={24}
                alt="Success Icon"
              />
              <h2 className="text-2xl font-semibold text-white">
                Message Sent!
              </h2>
            </div>
            <p className="text-lg font-light text-white">
              Thanks for completing the form. We&apos;ll be in touch soon.
            </p>
          </div>
        )}
        {/* Contact Form Container */}
        <div className="flex w-[90vw] flex-col justify-start rounded-2xl bg-white p-8">
          {/* Header */}
          <div className="mb-2 w-full text-2xl font-semibold md:text-3xl lg:text-4xl">
            <h1>Contact Us</h1>
          </div>
          {/* Contact Form */}
          <form onSubmit={handleFormSubmit}>
            {/* First + Last Name */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <div className="flex w-full flex-col">
                <label htmlFor="firstName">
                  First Name <span className="text-green-700">*</span>
                </label>
                <input
                  className={`mt-1 h-12 rounded-lg border-2 border-grey-900 pl-4 ${errors.firstName ? "border-red" : ""} text-xl hover:cursor-pointer hover:border-green-600 focus:border-green-600`}
                  type="text"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstName(e.target.value);
                    if (formSubmitted) {
                      const newErrors = validateForm({
                        ...getFormData(),
                        firstName: e.target.value,
                      });
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        firstName: newErrors.firstName,
                      }));
                    }
                  }}
                  name="firstName"
                  id="firstName"
                />
                {errors.firstName && (
                  <p className="text-sm text-red">{errors.firstName}</p>
                )}
              </div>
              <div className="flex w-full flex-col">
                <label htmlFor="lastName">
                  Last Name <span className="text-green-700">*</span>
                </label>
                <input
                  className={`mt-1 h-12 w-full rounded-lg border-2 ${errors.lastName ? "border-red" : ""} border-grey-900 pl-4 text-xl hover:cursor-pointer hover:border-green-600 focus:border-green-600`}
                  type="text"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setLastName(e.target.value);
                    if (formSubmitted) {
                      const newErrors = validateForm({
                        ...getFormData(),
                        lastName: e.target.value,
                      });
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        lastName: newErrors.lastName,
                      }));
                    }
                  }}
                  name="lastName"
                  id="lastName"
                />
                {errors.lastName && (
                  <p className="text-sm text-red">{errors.lastName}</p>
                )}
              </div>
            </div>
            {/* E-Mail */}
            <div className="mt-4">
              <div className="flex flex-col">
                <label htmlFor="email">
                  Email Address <span className="text-green-700">*</span>
                </label>
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    if (formSubmitted) {
                      const newErrors = validateForm({
                        ...getFormData(),
                        email: e.target.value,
                      });
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: newErrors.email,
                      }));
                    }
                  }}
                  className={`mt-1 h-12 w-full rounded-lg border-2 ${errors.email ? "border-red" : ""} border-grey-900 pl-4 text-xl hover:cursor-pointer hover:border-green-600 focus:border-green-600`}
                  type="email"
                  name="email"
                  id="email"
                />
                {errors.email && (
                  <p className="text-sm text-red">{errors.email}</p>
                )}
              </div>
            </div>
            {/* Query Type */}
            <div className="mt-4 flex flex-col gap-2">
              <p>
                Query Type <span className="text-green-600">*</span>
              </p>
              <div className="flex flex-col gap-2 md:flex-row">
                <label
                  htmlFor="generalEnquiry"
                  className={`flex h-12 w-full items-center gap-4 rounded-lg ${errors.queryType ? "border-red bg-red/50" : ""} border-2 border-grey-900 pl-4 text-lg font-light hover:cursor-pointer hover:border-green-600 ${selectedQuery === "generalEnquiry" ? "border-green-600 bg-green-200" : ""}`}
                >
                  <div className="relative flex">
                    <input
                      className={`h-5 w-5 appearance-none rounded-full ${selectedQuery === "generalEnquiry" ? "border-2 border-green-600" : "border-2 border-grey-500"}`}
                      type="radio"
                      id="generalEnquiry"
                      name="generalEnquiry"
                      onClick={() => {
                        setSelectedQuery("generalEnquiry");
                        if (formSubmitted) {
                          const newErrors = validateForm({
                            ...getFormData(),
                            queryType: "generalEnquiry",
                          });
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            queryType: newErrors.queryType,
                          }));
                        }
                      }}
                    />
                    {selectedQuery === "generalEnquiry" && (
                      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-green-600" />
                    )}
                  </div>
                  General Enquiry
                </label>
                <label
                  htmlFor="supportRequest"
                  className={`flex h-12 w-full items-center gap-4 rounded-lg border-2 border-grey-900 pl-4 text-lg ${errors.queryType ? "border-red bg-red/50" : ""} font-light hover:cursor-pointer hover:border-green-600 ${selectedQuery === "supportRequest" ? "border-green-600 bg-green-200" : ""}`}
                >
                  <div className={`relative flex`}>
                    <input
                      className={`h-5 w-5 appearance-none rounded-full ${selectedQuery === "supportRequest" ? "border-2 border-green-600" : "border-2 border-grey-500"}`}
                      type="radio"
                      name="supportRequest"
                      id="supportRequest"
                      onClick={() => {
                        setSelectedQuery("supportRequest");
                        if (formSubmitted) {
                          const newErrors = validateForm({
                            ...getFormData(),
                            queryType: "supportRequest",
                          });
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            queryType: newErrors.queryType,
                          }));
                        }
                      }}
                    />
                    {selectedQuery === "supportRequest" && (
                      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-green-600" />
                    )}
                  </div>
                  Support Request
                </label>
              </div>
              {errors.queryType && (
                <p className="text-sm text-red">{errors.queryType}</p>
              )}
            </div>
            {/* Message */}
            <div className="mt-4 flex flex-col">
              <label htmlFor="message">
                Message <span className="text-green-700">*</span>
              </label>
              <textarea
                className={`mt-1 h-48 w-full rounded-lg border-2 border-grey-900 px-4 py-2 text-xl ${errors.message ? "border-red" : ""} hover:cursor-pointer hover:border-green-600 focus:border-green-600`}
                name="message"
                id="message"
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setMessage(e.target.value);
                  if (formSubmitted) {
                    const newErrors = validateForm({
                      ...getFormData(),
                      message: e.target.value,
                    });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      message: newErrors.message,
                    }));
                  }
                }}
                maxLength={500}
              />
              <div className="flex flex-row-reverse items-center justify-between">
                <div className="text-right text-sm text-grey-500">
                  {message.length}/500
                </div>
                <div className="text-left">
                  {errors.message && (
                    <p className="text-sm text-red">{errors.message}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Consent Checkbox */}
            <div className="my-6 flex flex-col">
              <div className="mb-2 flex">
                <label
                  htmlFor="consentCheck"
                  className="flex items-center text-sm font-light hover:cursor-pointer"
                >
                  <button
                    id="consentCheck"
                    type="button"
                    className={`mr-4 h-5 w-5 appearance-none rounded-sm border-2 ${errors.consent ? "" : ""} ${consent ? "border-green-600" : "border-grey-500"} focus:outline-none`}
                    onClick={() => {
                      setConsent((prevConsent) => !prevConsent);
                      if (formSubmitted) {
                        const newErrors = validateForm({
                          ...getFormData(),
                          consent: !consent,
                        });
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          consent: newErrors.consent,
                        }));
                      }
                    }}
                  >
                    {consent ? (
                      <Image
                        src="/images/icon-checkbox-check.svg"
                        width={20}
                        height={20}
                        alt="Checked"
                      />
                    ) : null}
                  </button>
                  I consent to being contacted by the team{" "}
                  <span className="text-green-600">*</span>
                </label>
              </div>
              {errors.consent && (
                <p className="text-sm text-red">{errors.consent}</p>
              )}
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="mt-4 h-12 w-full rounded-lg bg-green-600 font-medium tracking-wider text-white hover:cursor-pointer hover:bg-emerald-900"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
