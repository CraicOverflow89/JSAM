class JSAM {
	ruleList: Array<JSAMRule> = [

		// Code Examples
		this.rule(/```\n([^`]*)\n```/g, "<pre><code>$1</code></pre>"),
		this.rule(/`([^`]*)`/g, "<pre><code>$1</code></pre>"),

		// Multiline Headers
		this.rule(/([^\n]*)\n(=)+\n/g, "<h1>$1</h1>"),
		this.rule(/([^\n]*)\n(-)+\n/g, "<h2>$1</h2>"),

		// Inline Headers
		this.rule(/###### ([^#\n]*)\n/g, "<h6>$1</h6>"),
		this.rule(/##### ([^#\n]*)\n/g, "<h5>$1</h5>"),
		this.rule(/#### ([^#\n]*)\n/g, "<h4>$1</h4>"),
		this.rule(/### ([^#\n]*)\n/g, "<h3>$1</h3>"),
		this.rule(/## ([^#\n]*)\n/g, "<h2>$1</h2>"),
		this.rule(/# ([^#\n]*)\n/g, "<h1>$1</h1>"),

		// Bold Format
		this.rule(/\*\*([^*]*)\*\*/g, "<b>$1</b>"),
		this.rule(/__([^_]*)__/g, "<b>$1</b>"),

		// Italic Format
		this.rule(/\*([^*]*)\*/g, "<i>$1</i>"),
		this.rule(/_([^_]*)_/g, "<i>$1</i>"),

		// Strikethrough Format
		this.rule(/~~([^~]*)~~/g, "<s>$1</s>"),

		// Line Break
		this.rule(/\n\n/g, "<br><br>")
	]

	convert(element: HTMLElement) {

		// Parse Element
		let input = element.innerHTML.replace(/\r/g, "")

		// Iterate Rules
		this.ruleList.forEach((rule) => {
			input = input.replace(rule.match, rule.replace)
		})

		// Update Element
		element.innerHTML = input
	}

	private rule(match: RegExp, replace: string): JSAMRule {
		return {
			match: match,
			replace: replace
		}
	}
}

interface JSAMRule {
	match: RegExp
	replace: string
}

// Create Parser
const jsam = new JSAM()