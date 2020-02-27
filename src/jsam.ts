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

		// Blockquotes
		this.ruleComplex(/(?:&gt; [^\n]+\n)+/, (match) => {
			const result: Array<string> = []
			result.push("<blockquote>")
			result.push(match.split("\n").map((item: string) => {
				return item.replace(/&gt; ([^\n]+)/, "$1")
			}).join("<br>"))
			result.push("</blockquote>")
			return result.join("")
		}),

		// Ordered Lists
		this.ruleComplex(/(?:^[0-9]\. [^\n]+$)(?:\n^[0-9]\. [^\n]+$)*/m, (match) => {
			const result: Array<string> = []
			result.push("<ol>")
			result.push(match.split("\n").map((item: string) => {
				return item.replace(/[0-9]\. ([^\n]*)/, "<li>$1</li>")
			}).join(""))
			result.push("</ol>")
			return result.join("")
		}),

		// Unordered Lists
		this.ruleComplex(/(?:^ - [^\n]+$)(?:\n^ - [^\n]+$)*/m, (match) => {
			const result: Array<string> = []
			result.push("<ul>")
			result.push(match.split("\n").map((item: string) => {
				return item.replace(/ - ([^\n]*)/, "<li>$1</li>")
			}).join(""))
			result.push("</ul>")
			return result.join("")
		}),

		// Images
		this.rule(/!\[([^\[\]\n]+)\]\(([^\[\]\n]+)\)/g, "<img src = \"$2\" alt = \"$1\" title = \"$1\" />"),

		// Links
		this.rule(/\[([^\[\]\n]+)\]\(([^\[\]\n]+)\)/g, "<a href = \"$2\">$1</a>"),

		// Line Break
		this.rule(/\n\n/g, "<br><br>")
	]

	convert(source: HTMLElement, target: HTMLElement = null) {

		// Parse Element
		let input = source instanceof HTMLTextAreaElement ? source.value : source.innerHTML
		input = input.replace(/\r/g, "").replace(/>/g, "&gt;")

		// Iterate Rules
		this.ruleList.forEach((rule) => {
			input = rule.invoke(input)
		})

		// Update Element
		const output = target == null ? source : target
		output.innerHTML = input
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
		let result: RegExpMatchArray
		while((result = input.match(this.match)) != null) {
			input = input.replace(result[0], this.replace(result[0]))
		}
		return input
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