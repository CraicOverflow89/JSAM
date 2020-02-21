class JSAM {
	ruleList: Array<JSAMRule> = [

		// Code Examples
		this.rule(/```\n([^`]*)\n```/g, "<pre><code>$1</code></pre>"),
		this.rule(/`([^`]*)`/g, "<code>$1</code>"),

		// Multiline Headers
		this.rule(/([^\n]+)\n(=)+\n/g, "<h1>$1</h1>"),
		this.rule(/([^\n]+)\n(-)+\n/g, "<h2>$1</h2>"),
		// NOTE: there might be some minimum char requirements to add here

		// Inline Headers
		this.rule(/###### ([^#\n]*)\n/g, "<h6>$1</h6>"),
		this.rule(/##### ([^#\n]*)\n/g, "<h5>$1</h5>"),
		this.rule(/#### ([^#\n]*)\n/g, "<h4>$1</h4>"),
		this.rule(/### ([^#\n]*)\n/g, "<h3>$1</h3>"),
		this.rule(/## ([^#\n]*)\n/g, "<h2>$1</h2>"),
		this.rule(/# ([^#\n]*)\n/g, "<h1>$1</h1>"),

		// Horizontal Rule
		this.rule(/\n\n(---|\*\*\*|___)\n\n/g, "<hr>"),

		// Bold Format
		this.rule(/\*\*([^*]*)\*\*/g, "<b>$1</b>"),
		this.rule(/__([^_]*)__/g, "<b>$1</b>"),

		// Italic Format
		this.rule(/\*([^*]*)\*/g, "<i>$1</i>"),
		this.rule(/_([^_]*)_/g, "<i>$1</i>"),

		// Strikethrough Format
		this.rule(/~~([^~]*)~~/g, "<s>$1</s>"),

		// Ordered Lists
		this.ruleComplex(/(?: [0-9]\. ([^\n]*)\n)+/g, (match) => {
			const result: Array<string> = []
			result.push("<ol>")
			match.split("\n").forEach((item: string) => {
				result.push(item.replace(/ [0-9]\. ([^\n]*)/, "<li>$1</li>"))
			})
			result.push("</ol><br>")
			return result.join("")
		}),

		// Unordered Lists
		this.ruleComplex(/(?: - ([^\n]*)\n)+/g, (match) => {
			const result: Array<string> = []
			result.push("<ul>")
			match.split("\n").forEach((item: string) => {
				result.push(item.replace(/ - ([^\n]*)/, "<li>$1</li>"))
			})
			result.push("</ul><br>")
			return result.join("")
		}),

		// Images
		this.rule(/!\[([^\[\]\n]+)\]\(([^\[\]\n]+)\)/g, "<img src = \"$2\" alt = \"$1\" title = \"$1\" />"),

		// Links
		this.rule(/\[([^\[\]\n]+)\]\(([^\[\]\n]+)\)/g, "<a href = \"$2\">$1</a>"),

		// Line Break
		this.rule(/\n\n/g, "<br><br>")
	]

	convert(element: HTMLElement) {

		// Parse Element
		let input = element.innerHTML.replace(/\r/g, "")

		// Iterate Rules
		this.ruleList.forEach((rule) => {
			input = rule.invoke(input)
		})

		// Update Element
		element.innerHTML = input
	}

	private rule(match: RegExp, replace: string): JSAMRule {
		return new JSAMRuleSimple(match, replace)
	}

	private ruleComplex(match: RegExp, replace: ((match: string) => string)): JSAMRule {
		return new JSAMRuleComplex(match, replace)
	}
	// NOTE: is it possible to have one rule method that takes arg of type string or Function
	//       to determine which class to create?
}

abstract class JSAMRule {
	match: RegExp

	constructor(match: RegExp) {
		this.match = match
	}

	abstract invoke(input: string): string
}

class JSAMRuleComplex extends JSAMRule {
	replace: Function

	constructor(match: RegExp, replace: ((match: string) => string)) {
		super(match)
		this.replace = replace
	}

	invoke(input: string): string {
		const result = input.match(this.match)
		return result == null ? input : input.replace(this.match, this.replace(result[0]))
	}
}

class JSAMRuleSimple extends JSAMRule {
	replace: string

	constructor(match: RegExp, replace: string) {
		super(match)
		this.replace = replace
	}

	invoke(input: string): string {
		return input.replace(this.match, this.replace)
	}
}

// Create Parser
const jsam = new JSAM()