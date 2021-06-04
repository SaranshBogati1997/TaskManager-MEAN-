import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';
import { TaskModel } from '../../models/task.model';
import { SubTaskModel } from '../../models/subtask.model';
import { switchMap } from 'rxjs/operators';
import { getLocaleCurrencyCode } from '@angular/common';
import { Router } from '@angular/router';
import { DataStoreService } from 'src/app/service/data.store.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  taskList: TaskModel[] = [];
  subTaskList: SubTaskModel[] = [];
  currentSubTaskList: SubTaskModel[] = [];
  currentTaskId: string;
  showCreateTaskModal: boolean = false;
  showCreateSubTaskModal: boolean = false;
  newTaskTitle: string;
  newSubTaskTitle: string;
  subTaskToEditId: string;
  isSubTaskEditMode: boolean = false;
  notificationMessage: string;
  showNotification: boolean = false;
  currentUser:UserModel;

  constructor(private taskService: TaskService, private router: Router, private dataStoreService:DataStoreService) {}

  ngOnInit(): void {
    var user = this.dataStoreService.getUser();
    if (!user || !user._id) {
      this.router.navigateByUrl('/login');
    }
    this.currentUser = user;

    this.taskService
      .getSubTasks(this.currentUser?._id!)
      .pipe(
        switchMap((subTasks) => {
          this.subTaskList = subTasks.data;
          return this.taskService.getTask(this.currentUser?._id!);
        })
      )
      .subscribe((tasks) => {
        this.taskList = tasks.data;
      });
  }

  taskClickEvent(task: TaskModel) {
    this.currentTaskId = task._id!;
    let allSubTasks = [...this.subTaskList];
    this.currentSubTaskList = allSubTasks.filter((e) => e._taskId === task._id);
  }
  onTaskModalSave() {
    var newTask: TaskModel = {
      title: this.newTaskTitle,
      userId: this.currentUser._id!
    };
    this.taskService.addTask(newTask).subscribe((res) => {
      var newTaskList = [...this.taskList, res.data];
      this.taskList = newTaskList;
    });
    this.toggleTaskModal();
    this.newTaskTitle = '';
  }
  onSubTaskModalSave() {
    if (this.subTaskToEditId && this.subTaskToEditId !== '') {
      this.editSubTasks();
      return;
    }
    this.toggleSubTaskModal();
    var subTask: SubTaskModel = {
      title: this.newSubTaskTitle,
      _taskId: this.currentTaskId,
    };
    this.taskService.addSubTask(subTask).subscribe((res) => {
      this.updateSubTaskList();
      this.showNotificationAlert('Added Successfully');
    });
    this.newSubTaskTitle = '';
  }
  showSubTaskEditModal(subTask: SubTaskModel) {
    this.newSubTaskTitle = subTask.title;
    this.subTaskToEditId = subTask._id!;
    this.toggleSubTaskModal();
  }
  editSubTasks() {
    var subtask: SubTaskModel = {
      title: this.newSubTaskTitle,
      _taskId: this.currentTaskId,
      _id: this.subTaskToEditId,
    };
    this.taskService.updateSubTask(subtask._id!, subtask).subscribe((res) => {
      this.updateSubTaskList();

      this.subTaskToEditId = '';
      this.newSubTaskTitle = '';
      this.toggleSubTaskModal();
      this.showNotificationAlert('Updated Successfully');
    });
  }
  deleteSubTasks(subTasks: SubTaskModel) {
    this.taskService.deleteSubTask(subTasks._id!).subscribe((res) => {
      this.updateSubTaskList();
      this.showNotificationAlert('Deleted Successfully');
    });
  }
  toggleSubTaskModal() {
    this.showCreateSubTaskModal = !this.showCreateSubTaskModal;
  }
  toggleTaskModal() {
    this.showCreateTaskModal = !this.showCreateTaskModal;
  }
  updateSubTaskList() {
    this.taskService.getSubTasks(this.currentUser._id!).subscribe((res) => {
      this.subTaskList = res.data;
      this.currentSubTaskList = [
        ...this.subTaskList.filter(
          (item) => item._taskId === this.currentTaskId
        ),
      ];
    });
  }
  updateTaskList(){
      this.taskService.getTask(this.currentUser._id!).subscribe(res => {
        this.taskList = [...res.data];
      })
  }
  showNotificationAlert(message: string) {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 2000);
  }
  signOut(){
    this.dataStoreService.setUser({username: ""})
    this.router.navigateByUrl("/login");
  }
  deleteTask(task:TaskModel){
    this.taskService.deleteTask(task._id!).subscribe(res => {
      this.updateTaskList();
      this.currentTaskId="";
      this.currentSubTaskList = [];
      this.showNotificationAlert("Task deleted")
    }) 
  }
}
