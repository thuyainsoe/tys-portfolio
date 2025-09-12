import React from "react";
import SectionTitle from "./SectionTitle";

const Contact = () => {
  return (
    <div className="mb-10 w-full">
      <SectionTitle
        title="Get in Touch"
        subtitle="Let's connect and discuss opportunities"
        centered={true}
      />
      <div className="max-w-2xl mx-auto">
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 lg:p-8 hover:border-neutral-700 transition-colors duration-300 text-center">
          <div className="space-y-4">
            <p className="text-neutral-400 text-sm leading-relaxed">
              Feel free to reach out for collaborations or just a friendly
              hello!
            </p>
            <a
              href="mailto:thuyainsoe163361@gmail.com"
              className="inline-block text-white hover:text-purple-400 transition-colors duration-200 text-lg font-medium"
            >
              thuyainsoe163361@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;