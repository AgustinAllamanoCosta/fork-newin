import { TnewinOptions } from "types/types"
import { gnomeStrategy } from "./strategies"

describe('Strategies', () => {
    describe('Gnome Strategies', () => {
        it('Given the command "npx foo" when the strategy gnome is call should return a command to open a new gnome terminal and run the npx foo', () => {
            const options: TnewinOptions = {}
            const cmd: string = 'npx foo'

            const terminalGenerated = gnomeStrategy(cmd, options)

            expect(terminalGenerated).toContain('gnome-terminal')
            expect(terminalGenerated).toContain('npx foo')
            expect(terminalGenerated).toContain('--window')
            expect(terminalGenerated).toContain('exec bash')
        })

        it('Given the command "npx foo" and the tab option is true when the strategy gnome is call should return a command to open a new gnome terminal in tab mode', () => {
            const options: TnewinOptions = { newTab: true }
            const cmd: string = 'npx foo'

            const terminalGenerated = gnomeStrategy(cmd, options)

            expect(terminalGenerated).toContain('gnome-terminal')
            expect(terminalGenerated).toContain('npx foo')
            expect(terminalGenerated).toContain('--tab')
            expect(terminalGenerated).toContain('exec bash')
        })

        it('Given the command "npx foo" and the title option is "some title" when the strategy gnome is call should return a command to open a new gnome terminal with title equal to "some title"', () => {
            const options: TnewinOptions = { title: "some title" }
            const cmd: string = 'npx foo'

            const terminalGenerated = gnomeStrategy(cmd, options)

            expect(terminalGenerated).toContain('gnome-terminal')
            expect(terminalGenerated).toContain('npx foo')
            expect(terminalGenerated).toContain('--window')
            expect(terminalGenerated).toContain('--title="some title"')
            expect(terminalGenerated).toContain('exec bash')
        })

        it('Given the command is empty when the strategy gnome is call should return a command to open a new gnome terminal with title equal to "some title"', () => {
            const options: TnewinOptions = { title: "some title" }
            const cmd: string = ''

            const terminalGenerated = gnomeStrategy(cmd, options)

            expect(terminalGenerated).toContain('gnome-terminal')
            expect(terminalGenerated).toContain('--window')
            expect(terminalGenerated).toContain('--title="some title"')
            expect(terminalGenerated).toContain('exec bash')
        })

        it('Given the command is npx foo and a work directory /bin/etc when the strategy gnome is call should return a command to open a new gnome terminal in the directory /bin/etc', () => {
            const options: TnewinOptions = { workdir: '/bin/etc' }
            const cmd: string = 'npx foo'

            const terminalGenerated = gnomeStrategy(cmd, options)

            expect(terminalGenerated).toContain('gnome-terminal')
            expect(terminalGenerated).toContain('npx foo')
            expect(terminalGenerated).toContain('--window')
            expect(terminalGenerated).toContain('--working-directory=/bin/etc')
            expect(terminalGenerated).toContain('exec bash')
        })
    })
})