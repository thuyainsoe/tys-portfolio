import { CONTACT } from "../constants";

const Contact = () => {
  return (
    <div className="mb-20 w-full">
      <h1 className="lg:text-center text-4xl mb-10 lg:mb-15 text-center">
        Get in touch
      </h1>
      <div className="text-center tracking-tighter">
        <p className="my-4 ">{CONTACT.address}</p>
        <p className="my-4">{CONTACT.phoneNo}</p>
        <a href={`mailto:${CONTACT.email}`} className="underline">
          {CONTACT.email}
        </a>
      </div>
    </div>
  );
};

export default Contact;
