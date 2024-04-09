import Image from "next/image";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<div className="branding">
				<Image
					src="/Logo-Draft.png"
					alt="Wheeler Peak Ice Logo"
					className="dark:invert w-auto w-auto"
					width={100}
					height={24}
					priority
				/>
			</div>

			<a
				href="https://www.mysmartice.com/"
				className="button inquiry"
				target="_blank"
				rel="noopener noreferrer"
			>
				Dealer Inquiries
			</a>

			<a
				href="/login"
				className="button login"
				target="_self"
				rel="noopener noreferrer"
			>
				Login
			</a>
		</main>
	);
}
