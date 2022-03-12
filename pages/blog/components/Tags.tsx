import Tag from "@/components/Tag";
import kebabCase from "@/lib/utils/kebabCase";
import Link from "next/link";
import React, { FC } from "react";

type Props = {
  tags: Record<string, number>;
};

export const Tags: FC<Props> = ({ tags }) => {
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

  return (
    <>
      <div className="Tags -m-2 flex flex-wrap">
        {Object.keys(tags).length === 0 && "No tags found."}
        {sortedTags.map((t) => {
          return (
            <div key={t} className="m-2">
              <Tag text={t} />
              <Link href={`/tags/${kebabCase(t)}`}>
                <a className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300">
                  {` (${tags[t]})`}
                </a>
              </Link>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .Tags {
        }
      `}</style>
    </>
  );
};
