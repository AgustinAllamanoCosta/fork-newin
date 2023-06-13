import { getFullCommandWindows, getFullKonsoleCommand, isWSLOrWindows, TnewinOptions } from '../commandAndArguments';
import { terminalBuilder } from './terminalBuilder';

jest.mock('node:child_process');
jest.mock('../commandAndArguments');
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

            const cmds: Array<string> =['npm run start:watch']
            const debug: boolean = false
            const options: TnewinOptions = { workdir: '~/project', close: true }

            await terminalBuilder(cmds, debug, options)

            expect(mockGetFullCommandWindows).toHaveBeenCalledWith(cmds[0],options)
        })
    })

    describe('Given a linux SO', () => {
        it('When the terminalBuilder function is called should generate a full command for linux OS', async () => {
            mockIsWSLOrWindows.mockReturnValue(false)

            const cmds: Array<string> =['npm run start:watch']
            const debug: boolean = false
            const options: TnewinOptions = { workdir: '~/project', close: true }

            await terminalBuilder(cmds, debug, options)

            expect(mockGetFullKonsoleCommand).toHaveBeenCalledWith(cmds[0],options)
        })
    })
})