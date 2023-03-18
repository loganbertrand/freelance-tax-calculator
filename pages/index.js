import { useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"

import styles from "../styles/Home.module.css"
import taxData from "../public/taxes.json"
import data from "../public/data.json"

export default function Home() {
	const [year, setYear] = useState(2022)

	const stateOptions = data.states
	const filingOptions = data.filingStatus
	const ageOptions = [
		{ value: "under65", label: "Under 65" },
		{ value: "over65", label: "Over 65" },
	]

	return (
		<div className={styles.container}>
			<Head>
				<title>Freelance Tax Calculator</title>
				<meta
					name="description"
					content="A Tax Calculator to estimate taxes owed for a Freelance worker for the tax years of 2022 and 2023"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Freelance Tax Calculator</h1>
				<h2>Please Select year</h2>
				<div className={styles.grid}>
					{year === 2022 ? (
						<>
							<div
								className={styles.cardFill}
								onClick={() => {
									setYear(2022)
								}}
							>
								<h3>2022</h3>
							</div>
							<div
								className={styles.card}
								onClick={() => {
									setYear(2023)
								}}
							>
								<h3>2023</h3>
							</div>
						</>
					) : (
						<>
							<div
								className={styles.card}
								onClick={() => {
									setYear(2022)
								}}
							>
								<h3>2022</h3>
							</div>
							<div
								className={styles.cardFill}
								onClick={() => {
									setYear(2023)
								}}
							>
								<h3>2023</h3>
							</div>
						</>
					)}
				</div>
				<span className={styles.label}>Income</span>
				<input className={styles.input} placeholder="ex: 10000"></input>
				<span className={styles.label}>State</span>
				<Dropdown
					options={stateOptions}
					placeholder="Select your Filing Status"
					className={styles.dropdown}
				/>
				<span className={styles.label}>Filing Status</span>
				<Dropdown
					options={filingOptions}
					placeholder="Select your Filing Status"
					className={styles.dropdown}
				/>
				<span className={styles.label}>Age</span>
				<Dropdown
					options={ageOptions}
					placeholder="Select your Age Range"
					className={styles.dropdown}
				/>
				<button>Submit</button>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{" "}
					<span className={styles.logo}>
						<Image
							src="/vercel.svg"
							alt="Vercel Logo"
							width={72}
							height={16}
						/>
					</span>
				</a>
			</footer>
		</div>
	)
}
