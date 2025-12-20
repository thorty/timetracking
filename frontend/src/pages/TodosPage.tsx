import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import { COLORS } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ProjectCard from '@/components/ProjectCard';
import styles from './TodosPage.module.css';

export default function TodosPage() {
  const { projects, refreshProjects } = useStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await api.projects.create({
        name: newProjectName,
        color: selectedColor,
      });
      await refreshProjects();
      setNewProjectName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects & Tasks</h1>
          <p className={styles.subtitle}>Organize your work into projects</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={20} />
          New Project
        </Button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <Card className={styles.createForm}>
          <form onSubmit={handleCreateProject}>
            <Input
              autoFocus
              label="Project Name"
              placeholder="e.g. Personal, Work, Study..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            
            <div className={styles.colorPicker}>
              <label className={styles.colorLabel}>Color</label>
              <div className={styles.colorGrid}>
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`${styles.colorButton} ${
                      selectedColor === color.name ? styles.selected : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <Button type="submit">Create Project</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
