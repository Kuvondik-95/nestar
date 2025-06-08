import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { Mutation, Query } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Member", schema: MemberSchema}]),
  ],
  providers: [MemberResolver, MemberService]
})
export class MemberModule {
  constructor(private readonly memberService: MemberService){}

  @Mutation(() => String)
  public async signup(): Promise<string>{
    console.log("Mutation: signup");
    return this.memberService.signup();
  }

  @Mutation(() => String)
  public async login(): Promise<string>{
    console.log("Mutation: login");
    return this.memberService.login();
  }
  
  @Mutation(() => String)
  public async updateMember(): Promise<string>{
    console.log("Mutation: updateMember");
    return this.memberService.updateMember();
  }

  @Query(() => String)
  public async getMember(): Promise<string>{
    console.log("Query: getMember");
    return this.memberService.getMember();
  }
}
