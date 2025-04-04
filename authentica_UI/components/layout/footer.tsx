import { BuyMeACoffee } from "../shared/icons";

export default function Footer() {
  return (
    <div className="absolute w-full py-5 text-center">
      <p className="text-gray-500">
        Authentica - Verifying AI-Generated Content
      </p>
      <p className="text-xs text-gray-400 mt-1">
        © {new Date().getFullYear()} Authentica. All rights reserved.
      </p>
    </div>
  );
}
