import { ResponseMessageDTO } from './response-message.dto';

export const ResponseMessageCreateDTO = ResponseMessageDTO.pick({ text: true, condition: true });
