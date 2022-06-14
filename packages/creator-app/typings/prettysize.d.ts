declare module 'prettysize' {
  /**
		Pretty print a size from bytes
		@method pretty
		@param {Number} size The number to pretty print
		@param {Boolean} [nospace=false] Don't print a space
		@param {Boolean} [one=false] Only print one character
		@param {Number} [places=1] Number of decimal places to return
		@param {Boolen} [numOnly] Return only the converted number and not size string
	*/
  export default function pretty(size: number, noSpace?: boolean, one?: boolean, places?: number, numOnly?: boolean): string;
}
