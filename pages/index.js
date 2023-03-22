import { useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"

import styles from "../styles/Home.module.css"
import data from "../public/data.json"
import {
	federalRates2022,
	federalRates2023,
	stateRates2022,
	stateRates2023,
} from "../public/data"

export default function Home() {
	const [year, setYear] = useState(2022)
	const [income, setIncome] = useState(0)
	const [state, setState] = useState("")
	const [filing, setFiling] = useState("")
	const [age, setAge] = useState(0)
	const [results, setResults] = useState(false)

	const [federalTax, setFederalTax] = useState()
	const [stateTax, setStateTax] = useState()
	const [selfTax, setSelfTax] = useState()

	const stateOptions = data.states
	const filingOptions = data.filingStatus
	// const ageOptions = [
	// 	{ value: "under65", label: "Under 65" },
	// 	{ value: "over65", label: "Over 65" },
	// ]

	const submitData = () => {
		console.log("submit button pressed")
		console.log("state: ", state)
		console.log("income: ", income)
		console.log("filing: ", filing)
		console.log("age: ", age)

		// Define the self-employment tax rate for the 2022 tax year
		const selfEmploymentRate = 0.153

		// Calculate the self-employment tax
		let selfEmploymentTax = income * selfEmploymentRate

		setSelfTax(selfEmploymentTax.toFixed(2))

		// Deduct half of the self-employment tax from taxable income for federal tax purposes
		let adjustedIncome = income - selfEmploymentTax / 2

		// Calculate the estimated federal tax owed based on adjusted income
		let federalTax = calculateFederalTax(adjustedIncome, filing)

		// Calculate estimated State Tax
		let stateTaxes = calculateStateTax(adjustedIncome, state, filing)

		console.log("Federal Tax: ", federalTax)
		console.log("Self Employment Tax: ", selfEmploymentTax)
		console.log("State Tax: ", stateTaxes)

		setResults(true)
	}

	const calculateFederalTax = (income, filing) => {
		const federalbrackets =
			year === 2022 ? federalRates2022[filing] : federalRates2023[filing]
		let fedTax = 0
		for (let i = 0; i < federalbrackets.length; i++) {
			const [minIncome, maxIncome, rate] = federalbrackets[i]
			if (income > maxIncome) {
				fedTax += (maxIncome - minIncome) * rate
			} else {
				fedTax += (income - minIncome) * rate
				break
			}
		}
		setFederalTax(fedTax.toFixed(2))
		return fedTax
	}

	const calculateStateTax = (income, state, filing) => {
		let fileType =
			filing === "marriedJoint"
				? "married"
				: filing === "single" || "marriedSep"
				? "single"
				: filing === "hoh"
				? "hoh"
				: null
		const brackets =
			year === 2022
				? stateRates2022[`${state.replace(/\s/g, "")}`][fileType]
						.brackets
				: stateRates2023[`${state.replace(/\s/g, "")}`][fileType]
						.brackets
		let stateTaxes = 0
		for (let i = 0; i < brackets.length; i++) {
			const [minIncome, maxIncome, rate] = brackets[i]
			if (income > maxIncome) {
				stateTaxes += (maxIncome - minIncome) * rate
			} else {
				stateTaxes += (income - minIncome) * rate
				break
			}
		}
		setStateTax(stateTaxes.toFixed(2))
		return stateTaxes
	}

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
				{!results && (
					<>
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
						<input
							className={styles.input}
							placeholder="ex: 10000"
							onChange={(e) => {
								setIncome(e.target.value)
							}}
						></input>
						<span className={styles.label}>State</span>
						<Dropdown
							options={stateOptions}
							placeholder="Select your State"
							className={styles.dropdown}
							onChange={(e) => {
								setState(e.value)
							}}
							value={state}
						/>
						<span className={styles.label}>Filing Status</span>
						<Dropdown
							options={filingOptions}
							placeholder="Select your Filing Status"
							className={styles.dropdown}
							onChange={(e) => {
								setFiling(e.value)
							}}
							value={filing}
						/>
						{/* <span className={styles.label}>Age</span>
						<Dropdown
							options={ageOptions}
							placeholder="Select your Age Range"
							className={styles.dropdown}
							onChange={(e) => {
								setAge(e.value)
							}}
							value={age}
						/> */}
						<div className={styles.button} onClick={submitData}>
							Submit
						</div>
					</>
				)}
				{results && (
					<>
						<h2>Results:</h2>
						<h4>
							Federal Tax:{" "}
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(federalTax)}
							<br />
							<br />
							Quarterly:{" "}
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(federalTax / 4)}
						</h4>
						<hr width={"80%"} />
						<h4>
							State Tax:{" "}
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(stateTax)}
							<br />
							<br />
							Quarterly:{" "}
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(stateTax / 4)}
						</h4>
						<hr width={"80%"} />
						<h4>
							Self-Employment Tax:{" "}
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(selfTax)}
							<br />
							<br />
							Quarterly:{" "}
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(selfTax / 4)}
						</h4>
						<a
							style={{ paddingTop: "5%", textDecoration: "none" }}
							href={"/"}
						>
							Try Again
						</a>
					</>
				)}
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
