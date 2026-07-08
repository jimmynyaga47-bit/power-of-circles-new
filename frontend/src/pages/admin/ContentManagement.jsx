function ContentManagement() {
  const sections = [
    {
      title: "Homepage",
      description: "Hero, About, Welcome Section",
    },
    {
      title: "Sponsors",
      description: "Manage Sponsors",
    },
    {
      title: "Founders",
      description: "Manage Founders",
    },
    {
      title: "Testimonials",
      description: "Manage Testimonials",
    },
    {
      title: "Gallery",
      description: "Manage Gallery",
    },
    {
      title: "Contact",
      description: "Manage Contact Details",
    },
    {
      title: "Footer",
      description: "Footer & Social Media",
    },
    {
      title: "Programs",
      description: "Manage Event Programs & Subscriptions",
    },
  ];

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Content Management
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {sections.map((section) => (

          <div
            key={section.title}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
          >

            <h2 className="text-xl font-bold">
              {section.title}
            </h2>

            <p className="text-gray-500 mt-3">
              {section.description}
            </p>
            <a
  href={`/admin/content/${section.title.toLowerCase()}`}
  className="inline-block mt-6 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
>
  Open
</a>


          </div>

        ))}

      </div>

    </div>
  );
}

export default ContentManagement;