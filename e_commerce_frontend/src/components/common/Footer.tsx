const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
        <p>Built for a simple shopping experience.</p>
      </div>
    </footer>
  );
};

export default Footer;
