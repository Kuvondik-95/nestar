import { Injectable } from '@nestjs/common';
import { BoardArticle } from '../../libs/dto/board-article/board-article';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BoardArticleService {
   constructor(
      @InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,
      // private authService: AuthService,
      // private viewService: ViewService,
      // private memberService: MemberService,
    ) {}
}
