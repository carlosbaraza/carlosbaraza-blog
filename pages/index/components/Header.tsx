import Link from "@/components/Link";
import SocialIcon from "@/components/social-icons";
import siteMetadata from "@/data/siteMetadata";
import React, { FC } from "react";

type Props = {};

export const Header: FC<Props> = () => {
  return (
    <>
      <div className="Header space-y-3">
        <div className="heading relative overflow-hidden rounded-3xl">
          <div className="absolute left-0 top-0 h-full w-full bg-gray-900 opacity-30" />
          <div className="relative flex flex-col space-y-2 p-6 md:space-y-2 md:p-7">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-white sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
              Build 🛠️, Launch 🚀, Repeat 🔁
            </h1>
            <p className="text-lg leading-7 text-white">
              {siteMetadata.description}
            </p>
          </div>
        </div>

        <div className="relative flex flex-row space-x-0 sm:space-x-3">
          <div className="cover-image relative min-h-full max-w-[150px] overflow-hidden rounded-bl-3xl rounded-tl-3xl sm:rounded-3xl  md:max-w-[200px]">
            <img
              src="/static/images/avatar-carlos-baraza-speaking.jpg"
              alt="Carlos Baraza"
              className="min-h-full object-cover object-[-20px] sm:object-center 2xs:object-left"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center space-y-3 overflow-hidden rounded-tr-3xl rounded-br-3xl bg-primary-800 p-4 sm:rounded-3xl sm:p-6 md:p-7">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl  md:text-5xl">
              Carlos Baraza
            </h2>
            <p className="text-lg leading-7 text-white">
              I write software and other philosophical stuff.{" "}
              <Link href="/about" className="font-bold text-slate-400">
                About me (Resume) &rarr;
              </Link>
            </p>
            <div className="!mt-4 flex">
              <div className="-m-4 flex flex-wrap p-2">
                <span className="p-2">
                  <SocialIcon
                    kind="mail"
                    href={`mailto:${siteMetadata.email}`}
                    size={6}
                    textColor="text-gray-200 hover:text-blue-400"
                  />
                </span>
                <span className="p-2">
                  <SocialIcon
                    kind="github"
                    href={siteMetadata.github}
                    size={6}
                    textColor="text-gray-200 hover:text-blue-400"
                  />
                </span>
                <span className="p-2">
                  <SocialIcon
                    kind="youtube"
                    href={siteMetadata.youtube}
                    size={6}
                    textColor="text-gray-200 hover:text-blue-400"
                  />
                </span>
                <span className="p-2">
                  <SocialIcon
                    kind="linkedin"
                    href={siteMetadata.linkedin}
                    size={6}
                    textColor="text-gray-200 hover:text-blue-400"
                  />
                </span>
                <span className="p-2">
                  <SocialIcon
                    kind="twitter"
                    href={siteMetadata.twitter}
                    size={6}
                    textColor="text-gray-200 hover:text-blue-400"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .heading {
          background: url(/static/images/banner.jpeg) repeat center;
          background-size: contain;
        }
      `}</style>
    </>
  );
};
