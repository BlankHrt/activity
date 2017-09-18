/**
 * Created by liuqinghua on 2017/8/5.
 */
export class Common {
  public static ArticleUpload = 'http://192.168.1.108:8000/upload/article';
  // public static ArticleUpload = 'http://www.ddshidai.com:8080/backend/upload/article';
  public static ActivityUpload = 'http://192.168.1.108:8000/upload/activity';
  // public static ActivityUpload = 'http://www.ddshidai.com:8080/backend/upload/activity';
  public static HeadUpload = 'http://192.168.1.108:8000/upload/head';
  // public static HeadUpload = 'http://www.ddshidai.com:8080/backend/upload/head';
  public static HttpUrl = 'http://192.168.1.101:8000';
  // public static HttpUrl = 'http://www.ddshidai.com:8080/backend';
  public static ArticleType = {
    // youji: 1,
    gonglue: 2,
    //  meishi: 3,
    // shishi: 4,
    xiaoyuan: 5,
    //  xiaonei: 6,
    //  yuanchuang: 7
  };
  public static ActivityType = {
    xiaoyuan: 1,
    huzhulvxing: 2
  };
}
