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
	const [totalTax, setTotalTax] = useState()

	const stateOptions = data.states
	const filingOptions = data.filingStatus

	const submitData = () => {
		// Define the self-employment tax rate for the 2022 tax year
		const selfEmploymentRate = 0.153

		// Calculate the self-employment tax
		let selfEmploymentTax = income * selfEmploymentRate

		setSelfTax(selfEmploymentTax.toFixed(2))

		// Calculate the estimated federal tax owed based on income
		let federalTax = calculateFederalTax(income, filing)

		// Calculate estimated State Tax
		let stateTaxes = calculateStateTax(income, state, filing)

		setTotalTax(federalTax + stateTaxes + selfEmploymentTax)

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
		let selectedState =
			state === "Washington, D.C." ? "WashingtonDC" : state
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
				? stateRates2022[`${selectedState.replace(/\s/g, "")}`][
						fileType
				  ].brackets
				: stateRates2023[`${selectedState.replace(/\s/g, "")}`][
						fileType
				  ].brackets
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
						<h2>Please select year</h2>
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
							placeholder="Select your state"
							controlClassName={styles.input}
							menuClassName={styles.dropdown}
							arrowClassName={styles.dropdownArrow}
							placeholderClassName={styles.placeholder}
							onChange={(e) => {
								setState(e.value)
							}}
							value={state}
						/>
						<span className={styles.label}>Filing Status</span>
						<Dropdown
							options={filingOptions}
							placeholder="Select your filing status"
							controlClassName={styles.input}
							menuClassName={styles.dropdown}
							arrowClassName={styles.dropdownArrow}
							placeholderClassName={styles.placeholder}
							onChange={(e) => {
								setFiling(e.value)
							}}
							value={filing}
						/>

						<div className={styles.button} onClick={submitData}>
							Submit
						</div>
					</>
				)}
				{results && (
					<>
						<h1>
							Estimated Total Owed:{" "}
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(totalTax)}
						</h1>
						<h2>Annual Split:</h2>
						<table className={styles.table}>
							<tbody>
								<tr className={styles.row}>
									<td>Federal</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(federalTax)}
									</td>
								</tr>
								<tr className={styles.row}>
									<td>State</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(stateTax)}
									</td>
								</tr>
								<tr className={styles.row}>
									<td>Self-Employment</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(selfTax)}
									</td>
								</tr>
								<hr width={"100%"} />
								<tr className={styles.row}>
									<td>Total</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(totalTax)}
									</td>
								</tr>
							</tbody>
						</table>
						<h2>Quarterly Split:</h2>
						<table className={styles.table}>
							<tbody>
								<tr className={styles.row}>
									<td>Federal</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(federalTax / 4)}
									</td>
								</tr>
								<tr className={styles.row}>
									<td>State</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(stateTax / 4)}
									</td>
								</tr>
								<tr className={styles.row}>
									<td>Self-Employment</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(selfTax / 4)}
									</td>
								</tr>
								<hr width={"100%"} />
								<tr className={styles.row}>
									<td>Total</td>
									<td>
										{Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(totalTax / 4)}
									</td>
								</tr>
							</tbody>
						</table>

						<a className={styles.button} href={"/"}>
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
