class JSAM {
	ruleList: Array<JSAMRule> = [

		// Code Examples
		this.rule(/```\n([^`]*)\n```/, "<pre><code>$1</code></pre>", true),
		this.rule(/`([^`]*)`/, "<pre><code>$1</code></pre>", true),

		// Inline Headers
		this.rule(/###### ([^#]*)/, "<h6>$1</h6>"),
		this.rule(/##### ([^#]*)/, "<h5>$1</h5>"),
		this.rule(/#### ([^#]*)/, "<h4>$1</h4>"),
		this.rule(/### ([^#]*)/, "<h3>$1</h3>"),
		this.rule(/## ([^#]*)/, "<h2>$1</h2>"),
		this.rule(/# ([^#]*)/, "<h1>$1</h1>"),

		// Bold Format
		this.rule(/\*\*([^*]*)\*\*/, "<b>$1</b>"),
		this.rule(/__([^_]*)__/, "<b>$1</b>"),

		// Italic Format
		this.rule(/\*([^*]*)\*/, "<i>$1</i>"),
		this.rule(/_([^_]*)_/, "<i>$1</i>"),

		// Strikethrough Format
		this.rule(/~~([^~]*)~~/, "<s>$1</s>")
	]

	convert(element: HTMLElement) {
		const input = element.innerHTML.replace(/\r/g, "")
		element.innerHTML = input.split("\n\n").map((it) => {

			// Iterate Rules
			this.ruleList.some((rule) => {

				// Absolute Rules
				if(rule.absolute) {
					if(it.match(rule.match)) {
						it = it.replace(rule.match, rule.replace)
						return true
					}
				}

				// Partial Rules
				it = it.replace(rule.match, rule.replace)
			})
			return it
		}).join("<br>")
	}

	private rule(match: RegExp, replace: string, absolute: boolean = false): JSAMRule {
		return {
			match: match,
			replace: replace,
			absolute: absolute
		}
	}
}

interface JSAMRule {
	match: RegExp
	replace: string
	absolute: boolean
}

// Create Parser
const jsam = new JSAM()