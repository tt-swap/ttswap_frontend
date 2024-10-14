import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from "next/navigation"

export function useLanguage() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    router.push(pathname+'?'+ lng );
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
  };
}