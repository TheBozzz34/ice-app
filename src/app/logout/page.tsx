"use client";

import { useEffect } from "react";
import logout from "./actions";

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <span className="text-black">You have been logged out</span>
    </>
  );
}
