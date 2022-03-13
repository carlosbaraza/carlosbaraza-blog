import React, { useRef, useState } from "react";
import classNames from "classnames";

import siteMetadata from "@/data/siteMetadata";

const NewsletterForm = ({ title = "Subscribe to the newsletter." }) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(`/api/${siteMetadata.newsletter.provider}`, {
      body: JSON.stringify({
        email: inputEl.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    if (error) {
      setError(true);
      setMessage(
        "Your e-mail address is invalid or you are already subscribed!"
      );
      return;
    }

    inputEl.current.value = "";
    setError(false);
    setSubscribed(true);
    setMessage("Successfully! 🎉 You are now subscribed.");
  };

  return (
    <div className="w-full max-w-md">
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </div>
      <div className="pb-3 text-sm text-gray-600 dark:text-gray-300">
        Only interesting stuff, no spam, I swear.
      </div>
      <form className="flex w-full flex-col sm:flex-row" onSubmit={subscribe}>
        <div className="flex-grow">
          <label className="sr-only" htmlFor="email-input">
            Email address
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-2xl px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-black"
            id="email-input"
            name="email"
            placeholder={
              subscribed ? "You're subscribed !  🎉" : "Enter your email"
            }
            ref={inputEl}
            required
            type="email"
            disabled={subscribed}
          />
        </div>
        <div className="mt-2 flex w-full rounded-2xl shadow-sm sm:mt-0 sm:ml-3 sm:w-auto">
          <button
            className={classNames(
              {
                "cursor-default": subscribed,
                "hover:bg-primary-700 dark:hover:bg-primary-400": !subscribed,
              },
              `w-full rounded-2xl bg-primary-500 py-2 px-4 font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:ring-offset-black sm:w-auto sm:py-0`
            )}
            type="submit"
            disabled={subscribed}
          >
            {subscribed ? "Thank you!" : "Subscribe"}
          </button>
        </div>
      </form>
      {error && (
        <div className="w-72 pt-2 text-sm text-red-500 dark:text-red-400 sm:w-96">
          {message}
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;

export const BlogNewsletterForm = ({ title }) => (
  <div className="flex w-full items-center justify-center rounded-2xl  bg-gray-100 dark:bg-gray-800">
    <div className=" p-6  sm:px-8 sm:py-8">
      <NewsletterForm title={title} />
    </div>
  </div>
);
