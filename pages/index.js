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
	const [income, setIncome] = useState(0)
	const [state, setState] = useState("")
	const [filing, setFiling] = useState("")
	const [age, setAge] = useState(0)

	const [federalTax, setFederalTax] = useState()
	const [stateTax, setStateTax] = useState()
	const [selfTax, setSelfTax] = useState()
	const [quarterTax, setQuarterTax] = useState()

	const [bracketRate, setBracketRate] = useState()
	const [bracketAmount, setBracketAmount] = useState()
	const [bracketFee, setBracketFee] = useState()
	const [bracketIndex, setBracketIndex] = useState()

	const stateOptions = data.states
	const filingOptions = data.filingStatus
	const ageOptions = [
		{ value: "under65", label: "Under 65" },
		{ value: "over65", label: "Over 65" },
	]

	const submitData = () => {
		console.log("submit button pressed")
		console.log("state: ", state)
		console.log("income: ", income)
		console.log("filing: ", filing)
		console.log("age: ", age)

		//Find the year
		switch (year) {
			case 2022:
				switch (filing) {
					case "single":
						switch (age) {
							case "over65":
								let deduction =
									data.deductions2022.single.over65

								//Income- Standard deduction = Taxable Income
								let taxableIncome = income - deduction
								taxData[2022].single.brackets.map((value) => {
									if (taxableIncome < value) {
										setFederalTax(taxableIncome)
									}
								})
							case "under65":
						}
					case "marriedJoint":
						switch (age) {
							case "over65":

							case "under65":
						}
					case "marriedSep":
						switch (age) {
							case "over65":

							case "under65":
						}
					case "hoh":
						switch (age) {
							case "over65":

							case "under65":
						}
					default:
						console.log("No filing status 2022")
				}
			case 2023:
				switch (filing) {
					case "single":
						switch (age) {
							case "over65":

							case "under65":
						}
					case "marriedJoint":
						switch (age) {
							case "over65":

							case "under65":
						}
					case "marriedSep":
						switch (age) {
							case "over65":

							case "under65":
						}
					case "hoh":
						switch (age) {
							case "over65":

							case "under65":
						}
					default:
						console.log("No filing status 2023")
				}
			default:
				console.log("No year selected")
		}

		if (year === 2022) {
			//Find the standard deduction for freelancer
			let deduction =
				age === "under65"
					? filing === "single"
						? data.deductions2022.single.under65
						: filing === "marriedJoint"
						? data.deductions2022.marriedJoint.under65
						: filing === "marriedSep"
						? data.deductions2022.marriedSep.under65
						: filing === "hoh"
						? data.deductions2022.hoh.under65
						: null
					: filing === "single"
					? data.deductions2022.single.over65
					: filing === "marriedJoint"
					? data.deductions2022.marriedJoint.over65
					: filing === "marriedSep"
					? data.deductions2022.marriedSep.over65
					: filing === "hoh"
					? data.deductions2022.hoh.over65
					: null

			//Income- Standard deduction = Taxable Income
			let taxableIncome = income - deduction

			//Find the bracket the freelancer belongs to
			let bracketPercent = taxData[2022].map((value) => {
				if (value === filing) {
					return taxData
				}
			})
			let bracketAmount
			let bracketFee

			//([Taxable Income - Minimum bracket amount] * Bracket %) + Bracket standard Tax = Federal
			let federalOwed = taxableIncome - taxData[2022].filing
		} else {
		}
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
					placeholder="Select your Filing Status"
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
				<span className={styles.label}>Age</span>
				<Dropdown
					options={ageOptions}
					placeholder="Select your Age Range"
					className={styles.dropdown}
					onChange={(e) => {
						setAge(e.value)
					}}
					value={age}
				/>
				<div className={styles.button} onClick={submitData}>
					Submit
				</div>
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
