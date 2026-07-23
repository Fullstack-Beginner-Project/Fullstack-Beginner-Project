import noImage from "../assets/images/img_thm_noimg.png";

const companyLogos = import.meta.glob(
  "../assets/images/company-logo-*.webp",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

export function getCompanyLogo(companyId) {
  const imagePath =
    `../assets/images/company-logo-${companyId}.webp`;

  return companyLogos[imagePath] ?? noImage;
}

export { noImage };