import { reviewService } from '@services/index';
import { makeApiResponse } from '@utils/index';
import logger from '@loaders/loggerLoader';
import { ReviewRequest, ReviewInsertRequest } from '@myTypes/Review';
import config from '@config/index';
import express, { Request, Response, RequestHandler } from 'express';

const router: express.Router = express.Router();

router.post('/initialize', (async (req: ReviewRequest, res: Response) => {
  try {
    if (req.body.password === config.admin_password) {
      if (req.body.type === 'Drop') {
        await reviewService.dropModel();
      }
      await reviewService.initializeReviewModel();
    } else {
      throw Error('관리자 암호가 잘못되었습니다.');
    }
    res
      .status(200)
      .json(
        makeApiResponse({}, 'Review Model이 정상적으로 초기화 되었습니다.'),
      );
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    res
      .status(500)
      .json(makeApiResponse({}, 'Review Model 초기화 중 오류가 발생했습니다.'));
  }
}) as RequestHandler);

router.post('/', (async (req: ReviewInsertRequest, res: Response) => {
  try {
    const insertData = {
      address: req.body.address,
      text: req.body.text,
      rate: req.body.categories,
    };
    if (!insertData) throw Error('비정상적인 후기 정보가 입력되었습니다.');
    await reviewService.insertReview(insertData);
    res
      .status(200)
      .json(makeApiResponse({}, '후기를 정상적으로 저장하였습니다.'));
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    res
      .status(500)
      .json(makeApiResponse({}, '후기를 정상적으로 저장하지 못했습니다.'));
  }
}) as RequestHandler);

export default router;