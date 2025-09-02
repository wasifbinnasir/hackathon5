interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({
  title,
  subtitle = "Lorem ipsum dolor sit amet consectetur. At in pretium tempor vitae eu eu mus.",
}: PageHeaderProps) {
  // Generate breadcrumbs automatically based on title
  const generateBreadcrumbs = (pageTitle: string) => {
    const breadcrumbs = [{ label: "Home", href: "/" }]

    // Add current page to breadcrumbs
    breadcrumbs.push({ label: pageTitle, href: "#" })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs(title)

  return (
    <div className="bg-[#C6D8F9] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="w-28 h-1 bg-primary mx-auto text-center"></p>

        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto mt-6">{subtitle}</p>

        <nav className="flex justify-center items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="text-gray-500 mx-2">{">"}</span>}
              <a
                href={crumb.href}
                className={`${
                  index === breadcrumbs.length - 1 ? "text-gray-800 font-medium" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {crumb.label}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
