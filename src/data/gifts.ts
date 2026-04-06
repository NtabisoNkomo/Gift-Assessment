export interface Gift {
  id: number;
  name: string;
  description: string;
  scriptures: string[];
  ministries: string[];
}

export const spiritualGifts: Gift[] = [
  { id: 1, name: "Administration", description: "The ability to organize, direct, and implement plans to lead others in various ministries.", scriptures: ["1 Cor 12:28"], ministries: ["Church Office", "Event Planning"] },
  { id: 2, name: "Apostleship", description: "The ability to pioneer new ministries or churches, often crossing cultural boundaries.", scriptures: ["Eph 4:11"], ministries: ["Church Planting", "Missions"] },
  { id: 3, name: "Craftsmanship", description: "The ability to use hands to build, maintain, or beautify the place of worship.", scriptures: ["Ex 31:3"], ministries: ["Maintenance", "Set Design"] },
  { id: 4, name: "Creative Communication", description: "The ability to communicate God's truth through various art forms.", scriptures: ["Ps 150:3-5"], ministries: ["Drama", "Media", "Worship"] },
  { id: 5, name: "Discernment", description: "The ability to distinguish between truth and error, good and evil.", scriptures: ["1 Cor 12:10"], ministries: ["Counseling", "Prayer Ministry"] },
  { id: 6, name: "Encouragement", description: "The ability to offer words of comfort, encouragement, and counsel.", scriptures: ["Rom 12:8"], ministries: ["Mentoring", "Support Groups"] },
  { id: 7, name: "Evangelism", description: "The ability to share the Gospel effectively so that others come to Christ.", scriptures: ["Eph 4:11"], ministries: ["Outreach", "Alpha Course"] },
  { id: 8, name: "Faith", description: "The ability to act on God's promises with confidence and unwavering belief.", scriptures: ["1 Cor 12:9"], ministries: ["Prayer Ministry", "Leadership"] },
  { id: 9, name: "Giving", description: "The ability to contribute material resources with cheerfulness and liberality.", scriptures: ["Rom 12:8"], ministries: ["Finance Committee", "Benevolence"] },
  { id: 10, name: "Healing", description: "The ability to serve as a human intermediary through whom God cures illnesses and restores health.", scriptures: ["1 Cor 12:9"], ministries: ["Hospital Visitation", "Prayer Ministry"] },
  { id: 11, name: "Helps", description: "The ability to work behind the scenes to support the work of the ministry.", scriptures: ["1 Cor 12:28"], ministries: ["Ushers", "Setup Team"] },
  { id: 12, name: "Hospitality", description: "The ability to make others feel welcome, comfortable, and cared for.", scriptures: ["1 Pet 4:9"], ministries: ["Greeters", "Welcome Center", "Food Ministry"] },
  { id: 13, name: "Intercession", description: "The ability to pray for extended periods on a regular basis for others.", scriptures: ["Col 4:12"], ministries: ["Prayer Chain", "Altar Ministry"] },
  { id: 14, name: "Interpretation", description: "The ability to make known to the body the message of one speaking in tongues.", scriptures: ["1 Cor 12:10"], ministries: ["Prophetic Ministry"] },
  { id: 15, name: "Knowledge", description: "The ability to discover, accumulate, and analyze truth for the body.", scriptures: ["1 Cor 12:8"], ministries: ["Teaching", "Research"] },
  { id: 16, name: "Leadership", description: "The ability to cast vision, motivate, and direct people to accomplish the purposes of God.", scriptures: ["Rom 12:8"], ministries: ["Small Group Leader", "Board Member"] },
  { id: 17, name: "Mercy", description: "The ability to feel and act upon genuine compassion for those who are suffering.", scriptures: ["Rom 12:8"], ministries: ["Care Ministry", "Hospital Visitation"] },
  { id: 18, name: "Miracles", description: "The ability to perform acts that alter the ordinary course of nature.", scriptures: ["1 Cor 12:10"], ministries: ["Prayer Ministry"] },
  { id: 19, name: "Prophecy", description: "The ability to declare the truth of God effectively to correct, encourage, or comfort.", scriptures: ["1 Cor 12:10"], ministries: ["Preaching", "Prayer Ministry"] },
  { id: 20, name: "Shepherding", description: "The ability to nurture, care for, and guide a group of believers toward spiritual maturity.", scriptures: ["Eph 4:11"], ministries: ["Small Groups", "Youth Ministry"] },
  { id: 21, name: "Teaching", description: "The ability to understand, clearly explain, and apply the Word of God.", scriptures: ["Rom 12:7"], ministries: ["Sunday School", "Bible Study"] },
  { id: 22, name: "Tongues", description: "The ability to speak in a language one has not learned, for prayer or a message to the church.", scriptures: ["1 Cor 12:10"], ministries: ["Prayer Ministry"] },
  { id: 23, name: "Wisdom", description: "The ability to apply spiritual truth to meet specific needs or situations.", scriptures: ["1 Cor 12:8"], ministries: ["Counseling", "Board Member"] },
  { id: 24, name: "Service", description: "The ability to identify and meet the practical needs of others.", scriptures: ["Rom 12:7"], ministries: ["Meals Ministry", "Facilities Team"] },
  { id: 25, name: "Celibacy", description: "The ability to remain single and enjoy it, to focus more fully on ministry.", scriptures: ["1 Cor 7:7"], ministries: ["Special Missions", "Singles Ministry"] },
  { id: 26, name: "Voluntary Poverty", description: "The ability to renounce material wealth for a lifestyle of simplicity and ministry.", scriptures: ["1 Cor 13:3"], ministries: ["Urban Ministry", "Missions"] },
];
