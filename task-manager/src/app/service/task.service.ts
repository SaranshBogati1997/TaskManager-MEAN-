import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { SubTaskModel } from '../models/subtask.model';
import { TaskModel } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http:HttpClient) { }

  getApiUrl(){
    return environment.apiUrl;
  }
  //task operation

  //get tasks
  getTask(userId:string):Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.getApiUrl()+ "/task/"+userId);
  }
  //add task
  addTask(task:TaskModel):Observable<ResponseModel>{
    return this.http.post<ResponseModel>(this.getApiUrl()+"/task", task );
  }
  //delete  task 
  deleteTask(id:string):Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(this.getApiUrl()+"/task/"+id);
  }
  //update  task 
  updateTask(id:string, task:TaskModel):Observable<ResponseModel>{
    return this.http.patch<ResponseModel>(this.getApiUrl()+"/task/"+id, task);
  }
  //get all subtask for given task 
  getAllSubtasksForTask(id:string):Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.getApiUrl()+"/task/subtask/"+id);
  }

  ///subtask operations 

  //delete  subtask 
  addSubTask(subtask:SubTaskModel):Observable<ResponseModel>{
    return this.http.post<ResponseModel>(this.getApiUrl()+"/subtask",subtask);
  }
  //get subtask 
  getSubTasks(userId:string):Observable<ResponseModel>{
    return this.http.get<ResponseModel>(this.getApiUrl()+"/subtask/"+userId);
  }
  //delete  task 
  deleteSubTask(id:string):Observable<ResponseModel>{
    return this.http.delete<ResponseModel>(this.getApiUrl()+"/subtask/"+id);
  }
  //delete  task 
  updateSubTask(id:string, subtask:SubTaskModel):Observable<ResponseModel>{
    return this.http.patch<ResponseModel>(this.getApiUrl()+"/subtask/"+id,subtask);
  }
}
