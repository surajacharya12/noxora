"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContentGallery from "../components/ContentGallery";
import ContentSection from "../components/featured";
import Hero from "../components/hero";
import Navbar from "../components/navbar";

export default function HomePage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
        } else {
            setIsAuth(true);
        }
    }, [router]);

    if (!isAuth) return null;

    return (
        <div>
            <Navbar />
            <Hero />
            <ContentSection />
            <ContentGallery />
        </div>
    );
}