export interface IUser {
  id?: number;
  userSrcId?: string;
  source?: string;
  userName: string;
  gradeLevel?: number;
  gradeName?: string;
  schoolName?: string;
  age?: string;
  gender?: string;
  dateOfBirth?: string;
  interestTopics?: string;
  showFlag?: number;
  //user_src_id,source,user_name,grade_level,grade_name,school_name,dob,topics_int,show_flag
}
