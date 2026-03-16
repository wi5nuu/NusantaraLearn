import lessons from '../data/lessons.json';
import quizzes from '../data/quizzes.json';
import stories from '../data/stories.json';

export const ContentService = {
  getLessonsByKelas(kelas: number) {
    return lessons.lessons.filter(l => l.kelas === kelas);
  },
  getLessonsBySubject(subject: string) {
    return lessons.lessons.filter(l => l.subject === subject);
  },
  getQuizForLesson(lessonId: string) {
    return quizzes.quizzes.find(q => q.lesson_id === lessonId)?.questions || [];
  },
  getStoriesByKelas(kelas: number) {
    return (stories as any[]).filter((s: any) => (s.min_kelas || 0) <= kelas);
  },
  searchContent(query: string) {
    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
    if (keywords.length === 0) return [];

    return lessons.lessons.filter(l => {
      const title = l.title.toLowerCase();
      const subject = l.subject.toLowerCase();
      // Match if ALL keywords are found in either title or subject
      return keywords.every(k => title.includes(k) || subject.includes(k));
    });
  }
};
