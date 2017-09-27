/**
 * Created by liuqinghua on 2017/8/5.
 */
export class Common {
  /* local */
  /*public static ArticleUpload = 'http://192.168.1.108:8000/upload/article';
  public static ActivityUpload = 'http://192.168.1.108:8000/upload/activity';
  public static HeadUpload = 'http://192.168.1.108:8000/upload/head';
  public static HttpUrl = 'http://localhost:8000';
  public static Url = 'http://localhost';*/

  /* server */
  public static ArticleUpload = 'http://www.ddshidai.com:8080/backend/upload/article';
  public static ActivityUpload = 'http://www.ddshidai.com:8080/backend/upload/activity';
  public static HeadUpload = 'http://www.ddshidai.com:8080/backend/upload/head';
  public static HttpUrl = 'http://www.ddshidai.com:8080/backend';
  public static Url = 'http://www.ddshidai.com';

  public static ActivityType = {
    xiaoyuan: 1,
    huzhulvxing: 2
  };
  public static ArticleType = {
    // youji: 1,
    gonglue: 2,
    //  meishi: 3,
    // shishi: 4,
    xiaoyuan: 5,
    //  xiaonei: 6,
    //  yuanchuang: 7
  };
}
