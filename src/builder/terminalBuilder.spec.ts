import { TnewinOptions } from 'types/types'
import { getFullCommandWindows, getFullKonsoleCommand, isWSLOrWindows } from '../commandAndArguments'
import { terminalBuilder } from './terminalBuilder'

jest.mock('node:child_process')
jest.mock('../commandAndArguments')

const mockIsWSLOrWindows = isWSLOrWindows as jest.Mock
const mockGetFullCommandWindows = getFullCommandWindows as jest.Mock
const mockGetFullKonsoleCommand = getFullKonsoleCommand as jest.Mock

describe('Terminal Builder', () => {

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('Given a windows SO', () => {
        it('When the terminalBuilder function is called should generate a full command for windows OS', async () => {
            mockIsWSLOrWindows.mockReturnValue(true)

            const cmd: string = 'npm run start:watch'
            const debug: boolean = false
            const options: TnewinOptions = { workdir: '~/project', close: true }

            await terminalBuilder(cmd, debug, options)

            expect(mockGetFullCommandWindows).toHaveBeenCalledWith(cmd,options)
        })
    })

    describe('Given a linux SO', () => {
        it('When the terminalBuilder function is called should generate a full command for linux OS', async () => {
            mockIsWSLOrWindows.mockReturnValue(false)

            const cmd: string = 'npm run start:watch'
            const debug: boolean = false
            const options: TnewinOptions = { workdir: '~/project', close: true }
            process.env.TERM = "konsole"

            await terminalBuilder(cmd, debug, options)

            expect(mockGetFullKonsoleCommand).toHaveBeenCalledWith(cmd,options)
        })
    })
})